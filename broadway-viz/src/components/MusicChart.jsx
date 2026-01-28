import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { stack, stackOffsetSilhouette, area, curveBasis, scaleLinear } from 'd3';
import { Share2 } from 'lucide-react';
import useSound from 'use-sound';
import data from '../assets/data/cleaned_data.json';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const CountUpNumber = ({ value, duration = 1.4 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const target = Number.isFinite(value) ? value : 0;
    const startValue = previousValue.current;
    previousValue.current = target;
    let start = null;
    let rafId = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const current = Math.round(startValue + (target - startValue) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const MusicChart = ({ selectedConductor: propSelectedConductor = 'all', setSelectedConductor: propSetSelectedConductor }) => {
  const { t } = useTranslation();
  const [hoveredNote, setHoveredNote] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedConductor, setSelectedConductor] = useState(propSelectedConductor);
  
  // Sync with prop when it changes externally
  useEffect(() => {
    if (propSelectedConductor !== undefined) {
      setSelectedConductor(propSelectedConductor);
    }
  }, [propSelectedConductor]);
  
  // Use prop setter if provided, otherwise use local state
  const handleSetSelectedConductor = (value) => {
    setSelectedConductor(value);
    if (propSetSelectedConductor) {
      propSetSelectedConductor(value);
    }
  };
  const [compareLeft, setCompareLeft] = useState('');
  const [compareRight, setCompareRight] = useState('');
  const [compareLeftQuery, setCompareLeftQuery] = useState('');
  const [compareRightQuery, setCompareRightQuery] = useState('');
  const [isLeftDropdownOpen, setIsLeftDropdownOpen] = useState(false);
  const [isRightDropdownOpen, setIsRightDropdownOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [containerWidth, setContainerWidth] = useState(900);
  const [activeRole, setActiveRole] = useState('all');
  const [pinnedRole, setPinnedRole] = useState('all');
  const [showDecades, setShowDecades] = useState(false);
  const [showRings, setShowRings] = useState(false);
  const [hoveredConductor, setHoveredConductor] = useState(null);
  const [hoveredStreamRole, setHoveredStreamRole] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudioEnabled, setHasAudioEnabled] = useState(false);
  const [shareNote, setShareNote] = useState(null);
  const chartRef = useRef(null);
  const shareCardRef = useRef(null);
  const leftDropdownRef = useRef(null);
  const rightDropdownRef = useRef(null);
  const selectedNoteDetailsRef = useRef(null);

  const isSmallScreen = containerWidth < 640;
  const isVertical = isSmallScreen;
  
  // Role mapping functions (defined early for use in calculations)
  const roleGroups = {
    "Conductor": new Set(["Conductor", "Substitute Conductor", "Associate Conductor"]),
    "Music Director": new Set(["Music Director", "Assistant Music Director", "Associate Music Director"]),
    "Music Supervisor": new Set(["Music Supervisor", "Associate Music Supervisor"])
  };

  const mapRoleToStream = (role) => {
    if (!role) return t('musicChart.roleNames.otherLeadership');
    if (roleGroups["Conductor"].has(role)) return t('musicChart.roleNames.conductor');
    if (roleGroups["Music Director"].has(role)) return t('musicChart.roleNames.musicDirector');
    if (roleGroups["Music Supervisor"].has(role)) return t('musicChart.roleNames.musicSupervisor');
    return t('musicChart.roleNames.otherLeadership');
  };
  
  // Calculate active roles count for adaptive sizing (based on filtered data)
  const activeRolesCount = useMemo(() => {
    if (selectedRole !== 'all') return 1;
    const filteredData = data
      .filter(d => d?.show_info?.opening && d?.conductor_info?.role)
      .filter(d => selectedConductor === 'all' || d?.conductor_info?.name === selectedConductor);
    const activeRoles = new Set(filteredData.map(d => mapRoleToStream(d?.conductor_info?.role)));
    return Math.max(1, activeRoles.size);
  }, [selectedRole, selectedConductor]);

  // Adaptive padding: smaller when filtered, responsive to viewport
  const basePadding = isSmallScreen ? 16 : 20;
  const adaptivePadding = useMemo(() => {
    const filterMultiplier = selectedRole !== 'all' || selectedConductor !== 'all' ? 0.7 : 1;
    const roleMultiplier = Math.max(0.6, Math.min(1, activeRolesCount / 4));
    return Math.max(12, basePadding * filterMultiplier * roleMultiplier);
  }, [basePadding, selectedRole, selectedConductor, activeRolesCount]);

  // Content-aware chart dimensions - optimized for viewport fit
  const chartWidth = isSmallScreen ? 360 : Math.min(900, containerWidth - 40);
  const chartHeight = useMemo(() => {
    const baseHeight = isSmallScreen ? 420 : 380;
    const roleHeight = activeRolesCount * 55; // ~55px per role stream (reduced from 60)
    const minHeight = isSmallScreen ? 350 : 320;
    const maxHeight = isSmallScreen ? 550 : 480;
    const calculated = Math.max(minHeight, Math.min(maxHeight, roleHeight + adaptivePadding * 2));
    return calculated;
  }, [isSmallScreen, activeRolesCount, adaptivePadding]);
  
  const chartPadding = adaptivePadding;
  const viewBoxSize = isSmallScreen ? 720 : 800;
  const center = viewBoxSize / 2;
  const rotations = 3.2;
  const maxTheta = Math.PI * 2 * rotations;
  const startAngle = -Math.PI / 2;
  const spiralGrowth = 14;
  const baseRadius = isSmallScreen ? 35 : 45;
  const lineGap = isSmallScreen ? 12 : 16;

  const [playBatonTap, { stop: stopBatonTap }] = useSound('/audio/piano.mp3', {
    volume: 0.85,
    interrupt: true,
    soundEnabled: !isMuted && hasAudioEnabled
  });

  const triggerTapSound = () => {
    if (!hasAudioEnabled || isMuted) return;
    playBatonTap();
  };

  const createShareFilename = (name) => {
    if (!name) return 'Milestone.png';
    return `${name.replace(/\s+/g, '_')}_Milestone.png`;
  };

  const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createShareImageDataUrl = async (note) => {
    const width = 1080;
    const height = 1350;
    const scale = 2; // crisp export

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.scale(scale, scale);

    // Background: deep theatre black with subtle radial glow
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      height * 0.3,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    bgGradient.addColorStop(0, '#14110f');
    bgGradient.addColorStop(0.5, '#050505');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Very soft vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.9
    );
    vignette.addColorStop(0.6, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Border + inner glow frame
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.68)';
    ctx.lineWidth = 4;
    ctx.strokeRect(26, 26, width - 52, height - 52);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Subtle horizontal "staff" lines behind content
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(245, 237, 211, 0.25)';
    ctx.lineWidth = 1;
    const staffTop = height * 0.28;
    const staffSpacing = 32;
    for (let i = -2; i <= 2; i += 1) {
      const y = staffTop + i * staffSpacing;
      ctx.beginPath();
      ctx.moveTo(120, y);
      ctx.lineTo(width - 120, y);
      ctx.stroke();
    }
    ctx.restore();

    // Typography
    const serif = '"Playfair Display", "Times New Roman", serif';
    const sans = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    // Respect RTL when Arabic
    const isRtl = typeof document !== 'undefined' && document.documentElement?.dir === 'rtl';
    ctx.direction = isRtl ? 'rtl' : 'ltr';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Helper: wrap text
    const wrapLines = (text, maxWidth, font) => {
      if (!text) return [''];
      ctx.font = font;
      const words = String(text).split(/\s+/).filter(Boolean);
      const lines = [];
      let line = '';
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width <= maxWidth) {
          line = test;
        } else {
          if (line) lines.push(line);
          line = word;
        }
      }
      if (line) lines.push(line);
      return lines.length ? lines : [''];
    };

    // Header
    ctx.fillStyle = '#D4AF37';
    ctx.font = `600 26px ${serif}`;
    const header = t('musicChart.shareImage.title');
    ctx.fillText(header, width / 2, 120);

    // Divider with baton-like accent
    ctx.save();
    ctx.translate(width / 2, 150);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.lineTo(110, 0);
    ctx.stroke();
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Optional portrait (if CORS allows image drawing)
    const portraitSize = 200;
    const portraitRadius = portraitSize / 2;
    const portraitY = 360;

    if (note?.photo) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = note.photo;

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        if (img.complete && img.naturalWidth > 0) {
          const px = width / 2;
          const py = portraitY;

          // Soft glow behind portrait
          const glowGradient = ctx.createRadialGradient(
            px,
            py,
            portraitRadius * 0.4,
            px,
            py,
            portraitRadius * 1.4
          );
          glowGradient.addColorStop(0, 'rgba(212,175,55,0.45)');
          glowGradient.addColorStop(1, 'rgba(212,175,55,0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(px, py, portraitRadius * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Circular masked image
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, portraitRadius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Draw image centered
          const imgAspect = img.width / img.height;
          let drawW = portraitSize;
          let drawH = portraitSize;
          if (imgAspect > 1) {
            drawW = portraitSize * imgAspect;
          } else {
            drawH = portraitSize / imgAspect;
          }
          ctx.drawImage(
            img,
            px - drawW / 2,
            py - drawH / 2,
            drawW,
            drawH
          );
          ctx.restore();

          // Gold ring
          ctx.strokeStyle = 'rgba(212,175,55,0.9)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(px, py, portraitRadius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      } catch (e) {
        // If CORS/tainting happens, silently skip portrait and continue
        console.warn('Share portrait draw skipped:', e);
      }
    }

    // Main content
    const conductorName = note?.conductor || '';
    const showTitle = note?.show || '';
    const date = note?.date || '';

    // Conductor (big)
    ctx.fillStyle = '#D4AF37';
    ctx.font = `700 64px ${serif}`;
    const nameLines = wrapLines(conductorName, 900, ctx.font);
    let y = portraitY + portraitRadius + 80;
    for (const line of nameLines.slice(0, 3)) {
      ctx.fillText(line, width / 2, y);
      y += 76;
    }

    // Show title (wrapped)
    ctx.fillStyle = '#f5edd3';
    ctx.font = `500 30px ${serif}`;
    const showLines = wrapLines(showTitle, 860, ctx.font);
    y += 10;
    for (const line of showLines.slice(0, 3)) {
      ctx.fillText(line, width / 2, y);
      y += 42;
    }

    // Date
    ctx.fillStyle = 'rgba(245, 237, 211, 0.7)';
    ctx.font = `600 18px ${sans}`;
    ctx.fillText(String(date), width / 2, y + 40);

    // Footer
    ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.font = `600 16px ${sans}`;
    const left = t('musicChart.shareImage.dataBy');
    const right = t('musicChart.shareImage.archive');
    ctx.textAlign = isRtl ? 'right' : 'left';
    ctx.fillText(left, 86, height - 86);
    ctx.textAlign = isRtl ? 'left' : 'right';
    ctx.fillText(right, width - 86, height - 86);

    return canvas.toDataURL('image/png');
  };

  const handleShare = async (note) => {
    if (!note) return;
    setShareNote(note);

    try {
      // Generate share image via Canvas (more reliable than DOM->PNG on some devices)
      const dataUrl = await createShareImageDataUrl(note);
      if (!dataUrl) throw new Error('Failed to create share image');

      const filename = createShareFilename(note.conductor);

      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: t('musicChart.shareTitle'),
            text: t('musicChart.shareText')
          });
          return;
        }
      }

      downloadDataUrl(dataUrl, filename);
    } catch (error) {
      console.error('Share image failed', error);
    }
  };

  const roles = [
    { name: t('musicChart.roleNames.conductor'), pos: 0 },
    { name: t('musicChart.roleNames.musicDirector'), pos: 1 },
    { name: t('musicChart.roleNames.musicSupervisor'), pos: 2 },
    { name: t('musicChart.roleNames.otherLeadership'), pos: 3 }
  ];
  const roleToPosition = roles.reduce((acc, role) => {
    acc[role.name] = role.pos;
    return acc;
  }, {});
  const roleNames = roles.map(role => role.name);

  const dates = useMemo(() => {
    return data.map(d => new Date(d?.show_info?.opening || '2000-01-01')).filter(d => !isNaN(d.getTime()));
  }, []);

  const minDate = useMemo(() => new Date('1915-01-01'), []);
  const maxDate = useMemo(() => new Date('2026-12-31'), []);

  const dateToTheta = (date) => {
    const timestamp = new Date(date).getTime();
    const minTimestamp = minDate.getTime();
    const maxTimestamp = maxDate.getTime();
    const ratio = (timestamp - minTimestamp) / (maxTimestamp - minTimestamp || 1);
    return startAngle + ratio * maxTheta;
  };

  const roleToLine = (role) => {
    return roleToPosition[mapRoleToStream(role)] ?? 0;
  };

  const getSpiralPoint = (theta, lineIndex) => {
    const radius = baseRadius + lineIndex * lineGap + spiralGrowth * theta;
    return {
      x: center + radius * Math.cos(theta),
      y: center + radius * Math.sin(theta)
    };
  };

  const notes = useMemo(() => {
    return data
      .filter(d => d?.show_info?.opening && d?.conductor_info?.role)
      .filter(d => selectedRole === 'all' || d?.conductor_info?.role === selectedRole)
      .filter(d => selectedConductor === 'all' || d?.conductor_info?.name === selectedConductor)
      .map((d, index) => ({
        id: `${d?.conductor_info?.name || 'Unknown'}-${d?.show_info?.title || 'Unknown'}-${d?.show_info?.opening || 'Unknown'}-${index}`,
        theta: dateToTheta(d.show_info.opening),
        lineIndex: roleToLine(d.conductor_info.role),
        ...getSpiralPoint(dateToTheta(d.show_info.opening), roleToLine(d.conductor_info.role)),
        conductor: d?.conductor_info?.name || 'Unknown',
        role: d?.conductor_info?.role || 'Unknown',
        streamRole: mapRoleToStream(d?.conductor_info?.role),
        show: d?.show_info?.title || 'Unknown',
        date: d?.show_info?.opening || 'Unknown',
        photo: d?.conductor_info?.photo || null,
        performances: Number(d?.show_info?.performances) || 0,
        time: new Date(d?.show_info?.opening || '').getTime()
      }));
  }, [selectedRole, selectedConductor]);

  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();

  const yearData = useMemo(() => {
    const years = [];
    for (let year = minYear; year <= maxYear; year += 1) {
      const base = { year };
      roleNames.forEach((role) => {
        base[role] = 0;
      });
      years.push(base);
    }
    const yearIndex = new Map(years.map((item, index) => [item.year, index]));
    notes.forEach((note) => {
      const year = new Date(note.date).getFullYear();
      const index = yearIndex.get(year);
      if (index === undefined) return;
      const streamRole = roleNames.includes(note.streamRole) ? note.streamRole : t('musicChart.roleNames.otherLeadership');
      years[index][streamRole] += 1;
    });
    return years;
  }, [notes, minYear, maxYear, roleNames]);

  const streamSeries = useMemo(() => {
    if (!yearData.length) return [];
    return stack()
      .keys(roleNames)
      .offset(stackOffsetSilhouette)(yearData);
  }, [yearData, roleNames]);

  // Calculate actual data bounds for optimal space usage
  const dataBounds = useMemo(() => {
    if (!streamSeries.length) return { min: -1, max: 1 };
    const allValues = streamSeries.flatMap(series =>
      series.flatMap(point => [point[0], point[1]])
    );
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    // Add small padding (5% of range) for visual breathing room
    const range = max - min || 2;
    const padding = range * 0.05;
    return {
      min: min - padding,
      max: max + padding
    };
  }, [streamSeries]);

  const maxStack = useMemo(() => {
    return Math.max(Math.abs(dataBounds.min), Math.abs(dataBounds.max), 1);
  }, [dataBounds]);

  const timeScale = useMemo(() => {
    return scaleLinear()
      .domain([minYear, maxYear])
      .range(isVertical ? [chartPadding, chartHeight - chartPadding] : [chartPadding, chartWidth - chartPadding]);
  }, [minYear, maxYear, isVertical, chartPadding, chartHeight, chartWidth]);

  // Optimized amplitude scale using actual data bounds
  const amplitudeScale = useMemo(() => {
    if (isVertical) {
      const availableWidth = chartWidth - chartPadding * 2;
      const amplitude = availableWidth * 0.45; // Use 90% of available width (45% each side)
      return scaleLinear()
        .domain([dataBounds.min, dataBounds.max])
        .range([chartWidth / 2 + amplitude, chartWidth / 2 - amplitude]);
    }
    // Horizontal layout: use actual data bounds for tighter vertical spacing
    const availableHeight = chartHeight - chartPadding * 2;
    const amplitude = availableHeight * 0.45; // Use 90% of available height
    return scaleLinear()
      .domain([dataBounds.min, dataBounds.max])
      .range([chartHeight / 2 - amplitude, chartHeight / 2 + amplitude]);
  }, [dataBounds, isVertical, chartWidth, chartHeight, chartPadding]);

  const areaGenerator = useMemo(() => {
    if (isVertical) {
      return area()
        .curve(curveBasis)
        .y(point => timeScale(point.data.year))
        .x0(point => amplitudeScale(point[0]))
        .x1(point => amplitudeScale(point[1]));
    }
    return area()
      .curve(curveBasis)
      .x(point => timeScale(point.data.year))
      .y0(point => amplitudeScale(point[0]))
      .y1(point => amplitudeScale(point[1]));
  }, [isVertical, timeScale, amplitudeScale]);

  const streamPaths = useMemo(() => {
    return streamSeries.map(series => areaGenerator(series));
  }, [streamSeries, areaGenerator]);

  const streamByRole = useMemo(() => {
    const map = new Map();
    streamSeries.forEach((series, index) => {
      map.set(roleNames[index], series);
    });
    return map;
  }, [streamSeries, roleNames]);

  const beads = useMemo(() => {
    if (!streamSeries.length) return [];
    return notes.map((note) => {
      const year = new Date(note.date).getFullYear();
      const clampedYear = Math.min(maxYear, Math.max(minYear, year));
      const yearIndex = clampedYear - minYear;
      const series = streamByRole.get(note.streamRole);
      if (!series || !series[yearIndex]) {
        return { ...note, cx: null, cy: null };
      }
      const mid = (series[yearIndex][0] + series[yearIndex][1]) / 2;
      const cx = isVertical ? amplitudeScale(mid) : timeScale(clampedYear);
      const cy = isVertical ? timeScale(clampedYear) : amplitudeScale(mid);
      return { ...note, cx, cy };
    });
  }, [notes, streamSeries, streamByRole, minYear, maxYear, isVertical, timeScale, amplitudeScale]);

  const noteRevealDelay = (year) => {
    if (!year) return 0;
    const clamped = Math.min(maxYear, Math.max(minYear, year));
    const ratio = (clamped - minYear) / (maxYear - minYear || 1);
    return ratio * 4;
  };

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    return notes.find(note => note.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const activeConductorCount = useMemo(() => {
    return new Set(notes.map(note => note.conductor).filter(Boolean)).size;
  }, [notes]);

  const conductorOptions = useMemo(() => {
    const unique = new Set(
      data.map(d => d?.conductor_info?.name).filter(Boolean)
    );
    const locale =
      (typeof navigator !== 'undefined' && navigator.language) || 'en';
    const collator = new Intl.Collator(locale, { sensitivity: 'base' });
    return Array.from(unique).sort((a, b) => collator.compare(a, b));
  }, []);

  const filteredLeftOptions = useMemo(() => {
    const query = compareLeftQuery.trim().toLowerCase();
    const baseOptions = compareRight
      ? conductorOptions.filter(name => name !== compareRight)
      : conductorOptions;
    const filtered = !query
      ? baseOptions
      : baseOptions.filter(name => name.toLowerCase().includes(query));
    const locale =
      (typeof navigator !== 'undefined' && navigator.language) || 'en';
    const collator = new Intl.Collator(locale, { sensitivity: 'base' });
    return filtered.slice().sort((a, b) => collator.compare(a, b));
  }, [conductorOptions, compareLeftQuery, compareRight]);

  const filteredRightOptions = useMemo(() => {
    const query = compareRightQuery.trim().toLowerCase();
    const baseOptions = compareLeft
      ? conductorOptions.filter(name => name !== compareLeft)
      : conductorOptions;
    const filtered = !query
      ? baseOptions
      : baseOptions.filter(name => name.toLowerCase().includes(query));
    const locale =
      (typeof navigator !== 'undefined' && navigator.language) || 'en';
    const collator = new Intl.Collator(locale, { sensitivity: 'base' });
    return filtered.slice().sort((a, b) => collator.compare(a, b));
  }, [conductorOptions, compareRightQuery, compareLeft]);

  // Prevent comparing the same person on both sides
  useEffect(() => {
    if (compareLeft && compareRight && compareLeft === compareRight) {
      setCompareRight('');
      setCompareRightQuery('');
    }
  }, [compareLeft, compareRight]);

  const conductorStats = useMemo(() => {
    const statsMap = new Map();
    data.forEach((entry) => {
      const name = entry?.conductor_info?.name;
      if (!name) return;
      const existing = statsMap.get(name) || {
        name,
        total: 0,
        minYear: null,
        maxYear: null,
        roleCounts: {},
        topShow: null,
        topPerformances: -1,
        photo: entry?.conductor_info?.photo || null
      };
      existing.total += 1;

      // Store photo if available and not already set
      if (!existing.photo && entry?.conductor_info?.photo) {
        existing.photo = entry.conductor_info.photo;
      }

      const role = entry?.conductor_info?.role;
      if (role) {
        existing.roleCounts[role] = (existing.roleCounts[role] || 0) + 1;
      }

      const opening = new Date(entry?.show_info?.opening || '');
      if (!Number.isNaN(opening.getTime())) {
        const year = opening.getFullYear();
        existing.minYear = existing.minYear === null ? year : Math.min(existing.minYear, year);
        existing.maxYear = existing.maxYear === null ? year : Math.max(existing.maxYear, year);
      }

      const performances = Number(entry?.show_info?.performances);
      const performanceCount = Number.isFinite(performances) ? performances : 0;
      const title = entry?.show_info?.title || 'Unknown';
      if (performanceCount > existing.topPerformances) {
        existing.topPerformances = performanceCount;
        existing.topShow = title;
      } else if (!existing.topShow && title) {
        existing.topShow = title;
      }

      statsMap.set(name, existing);
    });
    return statsMap;
  }, []);

  // Map conductor names to photos for dropdown thumbnails
  const conductorPhotoMap = useMemo(() => {
    const photoMap = new Map();
    data.forEach((entry) => {
      const name = entry?.conductor_info?.name;
      const photo = entry?.conductor_info?.photo;
      if (name && photo && !photoMap.has(name)) {
        photoMap.set(name, photo);
      }
    });
    return photoMap;
  }, []);

  const getConductorStats = (name) => {
    if (!name) return null;
    const stats = conductorStats.get(name);
    if (!stats) return null;
    const [topRole] = Object.entries(stats.roleCounts).sort((a, b) => b[1] - a[1])[0] || [];
    return {
      ...stats,
      topRole: topRole || 'Unknown',
      yearRange: stats.minYear && stats.maxYear ? `${stats.minYear} — ${stats.maxYear}` : 'Unknown',
      photo: stats.photo || null
    };
  };

  const leftStats = useMemo(() => getConductorStats(compareLeft), [compareLeft, conductorStats]);
  const rightStats = useMemo(() => getConductorStats(compareRight), [compareRight, conductorStats]);

  const performanceRange = useMemo(() => {
    const values = notes.map(note => note.performances).filter(v => Number.isFinite(v));
    if (!values.length) return { min: 0, max: 1 };
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [notes]);

  const getNoteRadius = (performances) => {
    const minRadius = 3;
    const maxRadius = 10;
    const range = performanceRange.max - performanceRange.min || 1;
    const scaled = (performances - performanceRange.min) / range;
    return minRadius + scaled * (maxRadius - minRadius);
  };

  useEffect(() => {
    if (selectedNoteId && !notes.find(note => note.id === selectedNoteId)) {
      setSelectedNoteId(null);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    // Only auto-scroll on mobile (bottom sheet)
    if (selectedNoteId && selectedNoteDetailsRef.current && isSmallScreen) {
      setTimeout(() => {
        selectedNoteDetailsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }, 100);
    }
  }, [selectedNoteId, isSmallScreen]);

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect?.width) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (leftDropdownRef.current && !leftDropdownRef.current.contains(event.target)) {
        setIsLeftDropdownOpen(false);
      }
      if (rightDropdownRef.current && !rightDropdownRef.current.contains(event.target)) {
        setIsRightDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleOptions = useMemo(() => {
    const uniqueRoles = [...new Set(data.map(d => d?.conductor_info?.role).filter(Boolean))];
    return uniqueRoles.sort();
  }, []);

  const activeConductor = hoveredConductor || (selectedConductor !== 'all' ? selectedConductor : null);

  const isFilterActive = activeRole !== 'all' || pinnedRole !== 'all';

  const handleLegendHover = (role) => {
    setActiveRole(role);
  };

  const handleLegendLeave = () => {
    setActiveRole(pinnedRole);
  };

  const handleLegendClick = (role) => {
    setPinnedRole(role);
    setActiveRole(role);
  };

  const decadeTicks = useMemo(() => [1920, 1940, 1960, 1980, 2000, 2020], []);
  const axisYears = useMemo(
    () => (isVertical ? [1920, 1970, 2026] : decadeTicks),
    [isVertical, decadeTicks]
  );

  const resetLegendFilter = () => {
    setPinnedRole('all');
    setActiveRole('all');
  };

  const lineIndexToRole = useMemo(() => {
    return roles.reduce((acc, role) => {
      acc[role.pos] = role.name;
      return acc;
    }, {});
  }, [roles]);

  const getRankLabel = (lineIndex) => lineIndexToRole[lineIndex] || 'Unknown';

  const trajectoryNotes = useMemo(() => {
    if (!activeConductor) return [];
    return data
      .filter(d => d?.show_info?.opening && d?.conductor_info?.role)
      .filter(d => d?.conductor_info?.name === activeConductor)
      .filter(d => selectedRole === 'all' || d?.conductor_info?.role === selectedRole)
      .map((d) => {
        const theta = dateToTheta(d.show_info.opening);
        const lineIndex = roleToLine(d.conductor_info.role);
        const point = getSpiralPoint(theta, lineIndex);
        return {
          x: point.x,
          y: point.y,
          time: new Date(d.show_info.opening).getTime()
        };
      })
      .filter(d => Number.isFinite(d.time))
      .sort((a, b) => a.time - b.time);
  }, [activeConductor, selectedRole, dateToTheta, roleToLine, getSpiralPoint]);

  const trajectoryPath = useMemo(() => {
    if (trajectoryNotes.length < 2) return '';
    let d = `M ${trajectoryNotes[0].x} ${trajectoryNotes[0].y}`;
    for (let i = 1; i < trajectoryNotes.length; i += 1) {
      const prev = trajectoryNotes[i - 1];
      const curr = trajectoryNotes[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
    }
    const last = trajectoryNotes[trajectoryNotes.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
  }, [trajectoryNotes]);

  const pioneerNoteId = useMemo(() => {
    const pioneer = notes.find(note => note.conductor === 'Linda Bloodgood');
    return pioneer?.id ?? null;
  }, [notes]);

  const updateTooltip = (event, note) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    setTooltip({
      note,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const spiralPaths = useMemo(() => {
    const steps = 500;
    return [0, 1, 2, 3, 4].map((lineIndex) => {
      let d = '';
      for (let i = 0; i <= steps; i += 1) {
        const theta = startAngle + (maxTheta * i) / steps;
        const point = getSpiralPoint(theta, lineIndex);
        d += i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`;
      }
      return d;
    });
  }, [startAngle, maxTheta, baseRadius, lineGap, spiralGrowth]);

  const decadeYears = useMemo(() => {
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    const start = Math.ceil(minYear / 20) * 20;
    const years = [];
    for (let year = start; year <= maxYear; year += 20) {
      years.push(year);
    }
    return years;
  }, [minDate, maxDate]);

  const gridRadius = baseRadius + lineGap * 4 + spiralGrowth * maxTheta + 20;

  return (
    <motion.div 
      className="px-0 py-8 sm:py-20 md:py-24 bg-gradient-to-b from-black via-gray-900/50 to-black"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full mx-auto px-1 sm:px-2">
        <div className="bg-black/40 border border-gray-700/60 p-3 sm:p-6 md:p-8 lg:p-10 rounded-lg overflow-hidden">
          <div className="text-center mb-3 sm:mb-6 md:mb-8">
            <h3 className="text-yellow-500 font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-4 font-bold flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl md:text-4xl">🎵</span>
              <span>{t('musicChart.title')}</span>
            </h3>
            <div className="w-full flex justify-center mb-2 sm:mb-4">
              <p className="text-gray-100 text-xs sm:text-sm md:text-base max-w-4xl leading-snug sm:leading-relaxed px-4 text-center">
                {t('musicChart.description')}
              </p>
            </div>

            {/* Role + Conductor Filters */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-2 sm:gap-8 flex-wrap">
              <div className="w-full lg:w-auto">
                <label className="block text-[10px] uppercase tracking-wider text-gray-200 mb-1.5 text-center lg:text-left font-semibold">
                  {t('musicChart.filterByRole')}
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(event) => setSelectedRole(event.target.value)}
                    className="w-full lg:w-72 px-3 py-2 rounded-lg bg-black/60 border border-gray-700/50 text-gray-300 focus:border-gray-600 focus:ring-1 focus:ring-gray-600/20 transition-all appearance-none text-sm"
                    aria-label={t('musicChart.filterByRole')}
                  >
                    <option value="all">{t('timeline.allRoles')} ({data.length})</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{t(`roles.${role}`, { defaultValue: role })}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                    ▾
                  </span>
                </div>
              </div>
              <div className="w-full lg:w-auto">
                <label className="block text-[10px] uppercase tracking-wider text-gray-200 mb-1.5 text-center lg:text-left font-semibold">
                  {t('musicChart.searchConductor')}
                </label>
                <div className="relative">
                  <select
                    value={selectedConductor}
                    onChange={(event) => handleSetSelectedConductor(event.target.value)}
                    className="w-full lg:w-72 px-3 py-2 rounded-lg bg-black/60 border border-gray-700/50 text-gray-300 focus:border-gray-600 focus:ring-1 focus:ring-gray-600/20 transition-all appearance-none text-sm"
                    aria-label={t('musicChart.searchConductor')}
                  >
                    <option value="all">{t('musicChart.allConductors')}</option>
                    {conductorOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                    ▾
                  </span>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            className="bg-black/30 rounded-lg p-2 sm:p-4 border border-gray-700/60 overflow-visible relative"
            ref={chartRef}
            animate={{ scale: isZoomed ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="hidden md:flex flex-col gap-1.5 absolute left-3 bottom-4 text-gray-200 text-[10px] border border-gray-700/70 rounded px-2 py-1.5 bg-black/60">
              <span className="text-[9px] uppercase tracking-wider text-gray-100 font-semibold">Circle size</span>
              <span className="text-[9px]">Number of productions</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/70" />
                <span className="text-[10px]">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="text-[10px]">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-yellow-400/90" />
                <span className="text-[10px]">High</span>
              </div>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1.5 text-[10px] text-gray-200 pointer-events-none">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500/60" />
              <span className="text-[9px] uppercase tracking-wider">Production</span>
            </div>
            <motion.button
              type="button"
              onClick={() => {
                setHasAudioEnabled(true);
                setIsMuted((prev) => {
                  if (!prev) {
                    stopBatonTap();
                  }
                  return !prev;
                });
              }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-3 left-3 z-20 w-7 h-7 rounded border border-gray-600/70 text-gray-200 flex items-center justify-center hover:border-gray-400 hover:text-white transition-all bg-black/60"
              aria-label={isMuted ? t('musicChart.unmute') : t('musicChart.mute')}
              title={isMuted ? t('musicChart.unmute') : t('musicChart.mute')}
            >
              {isMuted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5L5 9H2v6h3l4 4z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5L5 9H2v6h3l4 4z" />
                  <path d="M15 9.5a4 4 0 0 1 0 5" />
                  <path d="M18 7a7 7 0 0 1 0 10" />
                </svg>
              )}
            </motion.button>
            {/* Legend - Minimal and contextual */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <motion.button
                type="button"
                onClick={() => {
                  setShowRings((prev) => {
                    return !prev;
                  });
                }}
                onMouseEnter={() => handleLegendHover('role-rows')}
                onMouseLeave={handleLegendLeave}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all text-[10px] font-semibold ${
                  showRings || activeRole === 'role-rows' || pinnedRole === 'role-rows'
                    ? 'border-gray-500 text-gray-100 bg-black/60'
                    : 'border-gray-700/70 text-gray-200 hover:border-gray-500 hover:text-white bg-black/40'
                }`}
              >
                <span className="inline-flex items-center justify-center w-3 h-3 rounded border border-gray-500/70 text-[9px] text-gray-100">R</span>
                <span>{t('musicChart.legend.roleRows')}</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setShowDecades((prev) => {
                    return !prev;
                  });
                }}
                onMouseEnter={() => handleLegendHover('year-axis')}
                onMouseLeave={handleLegendLeave}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all text-[10px] font-semibold ${
                  showDecades || activeRole === 'year-axis' || pinnedRole === 'year-axis'
                    ? 'border-gray-500 text-gray-100 bg-black/60'
                    : 'border-gray-700/70 text-gray-200 hover:border-gray-500 hover:text-white bg-black/40'
                }`}
              >
                <span className="inline-flex items-center justify-center w-3 h-3 rounded border border-gray-500/70 text-[9px] text-gray-100">Y</span>
                <span>{t('musicChart.legend.yearAxis')}</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={resetLegendFilter}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all text-[10px] font-semibold ${
                  isFilterActive
                    ? 'border-gray-500 text-gray-100 bg-black/60'
                    : 'border-gray-700/70 text-gray-200'
                }`}
              >
                <span className="uppercase tracking-wider">{t('musicChart.showAll')}</span>
              </motion.button>
            </div>

            <div className="flex justify-center pb-1 sm:pb-2">
              <svg 
                width="100%"
                height={chartHeight}
                className="max-w-full cursor-crosshair"
                viewBox={`${-chartPadding} ${-chartPadding} ${chartWidth + chartPadding * 2} ${chartHeight + chartPadding * 2}`}
                preserveAspectRatio="xMidYMid meet"
                onPointerDown={() => setHasAudioEnabled(true)}
                role="img"
                aria-labelledby="music-chart-title music-chart-desc"
              >
                <title id="music-chart-title">
                  {t('musicChart.a11y.title', 'Women+ conductors on Broadway spiral timeline')}
                </title>
                <desc id="music-chart-desc">
                  {t(
                    'musicChart.a11y.description',
                    'A radial spiral chart showing Broadway productions with Women+ musical leaders over time, where position encodes year and color encodes leadership role.'
                  )}
                </desc>
                <g>
                  {/* Decade grid */}
                  <g style={{ opacity: showDecades ? 0.4 : 0 }} pointerEvents="none">
                    {decadeTicks.map((year) => {
                      const pos = timeScale(year);
                      return isVertical ? (
                        <g key={`decade-${year}`}>
                          <line
                            x1={chartPadding}
                            y1={pos}
                            x2={chartWidth - chartPadding}
                            y2={pos}
                            stroke="#D4AF37"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                          />
                          <text
                            x={chartWidth - chartPadding + 10}
                            y={pos}
                            fontSize="9"
                            fill="#F9FAFB"
                            textAnchor="start"
                            dominantBaseline="middle"
                          >
                            {year}
                          </text>
                        </g>
                      ) : (
                        <g key={`decade-${year}`}>
                          <line
                            x1={pos}
                            y1={chartPadding}
                            x2={pos}
                            y2={chartHeight - chartPadding}
                            stroke="#D4AF37"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                          />
                          <text
                            x={pos}
                            y={chartHeight - chartPadding + 12}
                            fontSize="9"
                            fill="#F9FAFB"
                            textAnchor="middle"
                          >
                            {year}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Time axis + guides */}
                  {isVertical ? (
                    <g pointerEvents="none">
                      {axisYears.map((year) => {
                        const pos = timeScale(year);
                        return (
                          <g key={`axis-${year}`}>
                            <line
                              x1={chartPadding}
                              y1={pos}
                              x2={chartWidth - chartPadding}
                              y2={pos}
                              stroke="#D4AF37"
                              strokeWidth={1}
                              strokeDasharray="2 4"
                              opacity={0.1}
                            />
                            <motion.text
                              x={chartWidth - chartPadding + 10}
                              y={pos}
                              fontSize="11"
                              fill="#F9FAFB"
                              textAnchor="start"
                              dominantBaseline="middle"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 1.5, ease: 'easeInOut' }}
                              viewport={{ amount: 0.2, once: true }}
                            >
                              {year}
                            </motion.text>
                          </g>
                        );
                      })}
                    </g>
                  ) : (
                    <g pointerEvents="none">
                      {axisYears.map((year) => {
                        const pos = timeScale(year);
                        return (
                          <g key={`axis-${year}`}>
                            <line
                              x1={pos}
                              y1={chartPadding}
                              x2={pos}
                              y2={chartHeight - chartPadding}
                              stroke="#D4AF37"
                              strokeWidth={1}
                              strokeDasharray="2 4"
                              opacity={0.1}
                            />
                            <motion.text
                              x={pos}
                              y={chartHeight - chartPadding + 16}
                              fontSize="11"
                              fill="#F9FAFB"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 1.5, ease: 'easeInOut' }}
                              viewport={{ amount: 0.2, once: true }}
                            >
                              {year}
                            </motion.text>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  <g>
                    {streamPaths.map((path, index) => {
                      const role = roleNames[index];
                      const isHovered = hoveredStreamRole === role;
                      const dimmed = hoveredStreamRole && !isHovered;
                      return (
                        <motion.path
                          key={role}
                          d={path}
                          fill="rgba(212,175,55,0.25)"
                          stroke={isHovered ? "rgba(212,175,55,0.9)" : "rgba(212,175,55,0.7)"}
                          strokeWidth={showRings ? 2.5 : 1.8}
                          opacity={dimmed ? 0.15 : 1}
                          onMouseEnter={() => setHoveredStreamRole(role)}
                          onMouseLeave={() => setHoveredStreamRole(null)}
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: dimmed ? 0.15 : 1 }}
                          transition={{ duration: 4, ease: 'easeInOut' }}
                          viewport={{ amount: 0.2, once: true }}
                          style={{
                            filter: isHovered ? 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' : 'none'
                          }}
                        />
                      );
                    })}

                    <AnimatePresence>
                      {beads.map((note, index) => {
                        if (note.cx === null || note.cy === null) return null;
                        const baseRadius = getNoteRadius(note.performances);
                        const isHovered = hoveredNote === note.id;
                        const matchesActiveRole = (() => {
                          if (activeRole === 'all') return true;
                          if (activeRole === 'hovered') return hoveredNote === note.id;
                          return note.streamRole === activeRole;
                        })();
                        const noteOpacity = matchesActiveRole ? (isHovered ? 1 : 0.85) : 0.2;
                        const noteYear = new Date(note.date).getFullYear();
                        return (
                          <motion.circle
                            key={note.id}
                            cx={note.cx}
                            cy={note.cy}
                            r={isHovered ? baseRadius + 3 : baseRadius}
                            fill={isHovered ? "#FFE589" : "#D4AF37"}
                            opacity={noteOpacity}
                            stroke={isHovered ? "#FFE589" : "#000"}
                            strokeWidth={isHovered ? 1 : 0.5}
                            style={{
                              cursor: 'pointer',
                              filter: isHovered ? 'drop-shadow(0 0 8px rgba(255,229,137,0.8))' : 'none'
                            }}
                            onMouseEnter={() => {
                              setHoveredNote(note.id);
                              triggerTapSound();
                            }}
                            onMouseLeave={() => {
                              setHoveredNote(null);
                            }}
                            onClick={() => setSelectedNoteId(note.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSelectedNoteId(note.id);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            initial={{ scale: 0.6, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: noteOpacity }}
                            transition={{ delay: noteRevealDelay(noteYear), duration: 0.5, ease: 'easeOut' }}
                            viewport={{ amount: 0.2, once: true }}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </g>
                </g>
              </svg>
            </div>

            
            {/* Zoom indicator - minimal */}
            {isZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-3 right-3 bg-black/80 border border-gray-600/70 text-gray-100 px-2 py-1 rounded text-[10px] font-semibold"
              >
                {t('musicChart.zoomedIn')}
              </motion.div>
            )}
          </motion.div>

          {/* Desktop: Centered Modal Overlay */}
          <AnimatePresence>
            {selectedNote && !isSmallScreen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setSelectedNoteId(null)}
                />
                {/* Centered Modal */}
                <motion.div
                  ref={selectedNoteDetailsRef}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gradient-to-br from-gray-900/98 to-black/98 border-2 border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/20 z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative p-6">
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedNoteId(null)}
                      className="absolute top-4 right-4 text-gray-100 hover:text-yellow-300 transition-colors text-xl z-10"
                      aria-label={t('musicChart.closeDetails')}
                    >
                      ✕
                    </button>
                    
                    {/* Header with Photo and Name */}
                    <div className="flex items-center gap-4 mb-6 pr-8">
                      {selectedNote.photo ? (
                        <img
                          src={selectedNote.photo}
                          alt={selectedNote.conductor}
                          className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500/50 flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-900/30 to-gray-900 border-2 border-yellow-500/50 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-serif text-yellow-400">
                            {getInitials(selectedNote.conductor)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-serif text-2xl mb-1">{selectedNote.conductor}</p>
                        <p className="text-yellow-500/80 text-xs uppercase tracking-wider">
                          {t(`roles.${selectedNote.role}`, { defaultValue: selectedNote.role })}
                        </p>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => handleShare(selectedNote)}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full border border-yellow-500/40 text-yellow-300 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-200 transition-all flex-shrink-0"
                        aria-label={t('musicChart.shareMilestone')}
                      >
                        <Share2 size={16} />
                      </motion.button>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-4">
                      <div className="border-b border-gray-700/70 pb-3">
                        <p className="text-gray-200 text-xs uppercase tracking-wider mb-2 font-semibold">Production</p>
                        <p className="text-gray-100 text-base font-medium">{selectedNote.show}</p>
                      </div>
                      <div className="border-b border-gray-700/70 pb-3">
                        <p className="text-gray-200 text-xs uppercase tracking-wider mb-2 font-semibold">{t('musicChart.openingDate')}</p>
                        <p className="text-gray-100 text-base">{selectedNote.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-200 text-xs uppercase tracking-wider mb-2 font-semibold">{t('musicChart.conductorRank')}</p>
                        <p className="text-yellow-400/80 text-base">{getRankLabel(selectedNote.lineIndex)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Mobile: Bottom Sheet with Snap Points */}
          <AnimatePresence>
            {selectedNote && isSmallScreen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setSelectedNoteId(null)}
                />
                {/* Bottom Sheet */}
                <motion.div
                  ref={selectedNoteDetailsRef}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-gradient-to-br from-gray-900 to-black border-t-2 border-yellow-500/30 rounded-t-2xl shadow-2xl z-50 overflow-y-auto"
                >
                  {/* Drag Handle */}
                  <div className="w-12 h-1 bg-yellow-500/30 rounded-full mx-auto mt-2 mb-4" />
                  
                  <div className="px-5 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-yellow-400 text-xs uppercase tracking-widest font-semibold">{t('musicChart.details')}</h3>
                      <button
                        onClick={() => setSelectedNoteId(null)}
                        className="text-gray-100 hover:text-yellow-300 transition-colors text-xl"
                        aria-label={t('musicChart.closeDetails')}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-5">
                      {selectedNote.photo ? (
                        <img
                          src={selectedNote.photo}
                          alt={selectedNote.conductor}
                          className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/50"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-900/30 to-gray-900 border-2 border-yellow-500/50 flex items-center justify-center">
                          <span className="text-xl font-serif text-yellow-400">
                            {getInitials(selectedNote.conductor)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-serif text-xl mb-1">{selectedNote.conductor}</p>
                        <p className="text-yellow-500/80 text-xs uppercase tracking-wider">
                          {t(`roles.${selectedNote.role}`, { defaultValue: selectedNote.role })}
                        </p>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => handleShare(selectedNote)}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full border border-yellow-500/40 text-yellow-300 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-200 transition-all"
                        aria-label={t('musicChart.shareMilestone')}
                      >
                        <Share2 size={16} />
                      </motion.button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-b border-gray-700/70 pb-3">
                        <p className="text-gray-200 text-xs uppercase tracking-wider mb-2 font-semibold">Production</p>
                        <p className="text-gray-100 text-base font-medium">{selectedNote.show}</p>
                      </div>
                      <div className="border-b border-gray-700/70 pb-3">
                        <p className="text-gray-200 text-xs uppercase tracking-wider mb-2 font-semibold">{t('musicChart.openingDate')}</p>
                        <p className="text-gray-100 text-base">{selectedNote.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-200 text-xs uppercase tracking-wider mb-2 font-semibold">{t('musicChart.conductorRank')}</p>
                        <p className="text-yellow-400/80 text-base">{getRankLabel(selectedNote.lineIndex)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div
            ref={shareCardRef}
            style={{
              // Keep the node in the viewport for reliable html-to-image rendering,
              // but make it fully invisible and non-interactive.
              position: 'fixed',
              top: 0,
              left: 0,
              width: '1080px',
              height: '1350px',
              opacity: 0,
              pointerEvents: 'none',
              backgroundColor: '#050505',
              border: '2px solid rgba(212, 175, 55, 0.55)',
              padding: '80px',
              color: '#f7e7a6',
              fontFamily: '"Playfair Display", serif'
            }}
            aria-hidden="true"
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '26px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37' }}>
                  {t('musicChart.shareImage.title')}
                </div>
                <div style={{ height: '2px', width: '160px', background: 'rgba(212, 175, 55, 0.4)' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '26px' }}>
                <div style={{ fontSize: '64px', color: '#D4AF37', fontWeight: 700 }}>
                  {shareNote?.conductor || ''}
                </div>
                <div style={{ fontSize: '28px', color: '#f5edd3' }}>
                  {shareNote?.show || ''}
                </div>
                <div style={{ fontSize: '18px', color: 'rgba(245, 237, 211, 0.7)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {shareNote?.date || ''}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', color: 'rgba(212, 175, 55, 0.7)' }}>
                <span>{t('musicChart.shareImage.dataBy')}</span>
                <span>{t('musicChart.shareImage.archive')}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="text-center bg-black/20 border border-gray-700/60 rounded px-3 py-2">
              <p className="text-gray-200 text-[10px] sm:text-xs text-center">
                💡 {t('musicChart.tipClickNote')}
              </p>
            </div>
            <div className="text-center bg-black/20 border border-gray-700/60 rounded px-3 py-2">
              <p className="text-gray-200 text-[10px] sm:text-xs text-center">
                🔍 {t('musicChart.tipDoubleClick')}
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mt-4 sm:mt-5 text-center bg-black/20 border border-gray-700/60 rounded px-3 py-2.5">
            <p className="text-gray-200 text-xs sm:text-sm text-center">
              <Trans i18nKey="musicChart.displaying" values={{ count: notes.length }}>
                Displaying <span className="text-gray-100 font-medium">{notes.length}</span> productions
              </Trans>
              {selectedRole !== 'all' && <span className="text-gray-200"> — {t('musicChart.filteredBy')} <span className="text-gray-100">{selectedRole}</span></span>}
              {selectedConductor !== 'all' && <span className="text-gray-200"> — {t('musicChart.focusMode')} <span className="text-gray-100">{selectedConductor}</span></span>}
              {selectedConductor === 'all' && activeConductorCount > 1 && (
                <span className="text-gray-200"> — {t('musicChart.activeConductors')} <span className="text-gray-100">{activeConductorCount}</span></span>
              )}
            </p>
          </div>

          <motion.div
            className="mt-4 sm:mt-6 bg-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur overflow-visible"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-2 sm:mb-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-yellow-300/80 font-serif">{t('musicChart.compare.comparisonDashboard')}</p>
              <p className="text-gray-100 text-xs sm:text-sm mt-0.5 font-serif">{t('musicChart.compare.compareLegacies')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
              <motion.div
                className="bg-black/30 border border-gray-700/60 rounded-lg p-3 sm:p-4 flex flex-col gap-3 overflow-visible"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                >
                <label className="text-[10px] uppercase tracking-wider text-gray-200 font-serif font-semibold">
                  {t('musicChart.compare.selectConductorA')}
                </label>
                <div className="relative z-50" ref={leftDropdownRef}>
                  <input
                    value={compareLeftQuery}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setCompareLeftQuery(nextValue);
                      if (nextValue !== compareLeft) {
                        setCompareLeft('');
                      }
                      setIsLeftDropdownOpen(true);
                    }}
                    onFocus={() => setIsLeftDropdownOpen(true)}
                    placeholder={t('musicChart.compare.searchPlaceholder')}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-gray-700/50 text-gray-300 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all font-serif text-sm"
                    aria-label={t('musicChart.compare.selectConductorA')}
                  />
                  <AnimatePresence>
                    {isLeftDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 mt-2 max-h-[300px] overflow-y-auto bg-black/90 backdrop-blur-xl border border-yellow-500/40 rounded-lg z-50 shadow-lg"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.6) transparent' }}
                      >
                        {filteredLeftOptions.length ? (
                          filteredLeftOptions.map((name) => {
                            const photo = conductorPhotoMap.get(name);
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => {
                                  setCompareLeft(name);
                                  setCompareLeftQuery(name);
                                  setIsLeftDropdownOpen(false);
                                }}
                                className="w-full text-left py-2.5 px-4 text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors font-serif flex items-center gap-3"
                              >
                                {photo ? (
                                  <img
                                    src={photo}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover border border-yellow-500/30 flex-shrink-0"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-900/30 to-gray-900 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-serif text-yellow-500/60 font-semibold">{getInitials(name)}</span>
                                  </div>
                                )}
                                <span>{name}</span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="py-3 px-4 text-sm text-gray-100 font-serif text-center">
                            No conductor found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Conductor Photo/Silhouette Placeholder */}
                <div className="relative w-20 h-20 mx-auto mb-2">
                  {leftStats?.photo ? (
                    <motion.img
                      key={compareLeft}
                      src={leftStats.photo}
                      alt={compareLeft}
                      className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500/60 shadow-lg shadow-yellow-500/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/40 to-gray-900/60 border-2 border-gray-700/40 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600/40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                {leftStats ? (
                  <div className="flex flex-col gap-2.5">
                    <div className={`text-3xl sm:text-4xl font-semibold font-serif ${
                      leftStats.total > (rightStats?.total || 0) 
                        ? 'text-yellow-400 text-[2.5rem] sm:text-[2.75rem] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                        : 'text-yellow-400'
                    }`}>
                      <CountUpNumber value={leftStats.total} />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-gray-100 font-serif text-center">
                      {t('musicChart.compare.totalRecordedProductions')}
                    </div>
                    <div className="text-sm text-gray-200 font-sans">
                      <span className="text-yellow-300/80">{t('musicChart.compare.careerTimeline')}</span> {leftStats.yearRange}
                    </div>
                    <div className="text-sm text-gray-200 font-sans">
                      <span className="text-yellow-300/80">{t('musicChart.compare.leadershipProfile')}</span> {leftStats.topRole}
                    </div>
                    <div className="text-sm text-gray-200 font-sans">
                      <span className="text-yellow-300/80">{t('musicChart.compare.signatureWork')}</span> {leftStats.topShow || t('dataTable.unknown')}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center text-gray-100 text-sm font-sans min-h-[120px]">
                    {compareRight ? t('musicChart.compare.selectAnother') : t('musicChart.compare.chooseToBegin')}
                  </div>
                )}
              </motion.div>

              {/* VS Divider with Golden Gradient and Circular Border */}
              <div className="flex items-center justify-center gap-3 text-yellow-300/70 md:flex-col">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent md:h-full md:w-px md:bg-gradient-to-b md:from-transparent md:via-yellow-500/30 md:to-transparent md:flex-1" />
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-500/40"></div>
                  <span className="text-xs uppercase tracking-[0.35em] px-3 py-1.5 font-serif relative z-10">{t('musicChart.compare.vs')}</span>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent md:h-full md:w-px md:bg-gradient-to-b md:from-transparent md:via-yellow-500/30 md:to-transparent md:flex-1" />
              </div>

              <motion.div
                className="bg-black/30 border border-gray-700/60 rounded-lg p-3 sm:p-4 flex flex-col gap-3 overflow-visible"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label className="text-[10px] uppercase tracking-wider text-gray-200 font-serif font-semibold">
                  {t('musicChart.compare.selectConductorB')}
                </label>
                <div className="relative z-50" ref={rightDropdownRef}>
                  <input
                    value={compareRightQuery}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setCompareRightQuery(nextValue);
                      if (nextValue !== compareRight) {
                        setCompareRight('');
                      }
                      setIsRightDropdownOpen(true);
                    }}
                    onFocus={() => setIsRightDropdownOpen(true)}
                    placeholder={t('musicChart.compare.searchPlaceholder')}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-gray-700/50 text-gray-300 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all font-serif text-sm"
                    aria-label={t('musicChart.compare.selectConductorB')}
                  />
                  <AnimatePresence>
                    {isRightDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 mt-2 max-h-[300px] overflow-y-auto bg-black/90 backdrop-blur-xl border border-yellow-500/40 rounded-lg z-50 shadow-lg"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.6) transparent' }}
                      >
                        {filteredRightOptions.length ? (
                          filteredRightOptions.map((name) => {
                            const photo = conductorPhotoMap.get(name);
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => {
                                  setCompareRight(name);
                                  setCompareRightQuery(name);
                                  setIsRightDropdownOpen(false);
                                }}
                                className="w-full text-left py-2.5 px-4 text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors font-serif flex items-center gap-3"
                              >
                                {photo ? (
                                  <img
                                    src={photo}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover border border-yellow-500/30 flex-shrink-0"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-900/30 to-gray-900 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-serif text-yellow-500/60 font-semibold">{getInitials(name)}</span>
                                  </div>
                                )}
                                <span>{name}</span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="py-3 px-4 text-sm text-gray-100 font-serif text-center">
                            No conductor found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Conductor Photo/Silhouette Placeholder */}
                <div className="relative w-20 h-20 mx-auto mb-2">
                  {rightStats?.photo ? (
                    <motion.img
                      key={compareRight}
                      src={rightStats.photo}
                      alt={compareRight}
                      className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500/60 shadow-lg shadow-yellow-500/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/40 to-gray-900/60 border-2 border-gray-700/40 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600/40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                {rightStats ? (
                  <div className="flex flex-col gap-2.5">
                    <div className={`text-3xl sm:text-4xl font-semibold font-serif ${
                      rightStats.total > (leftStats?.total || 0) 
                        ? 'text-yellow-400 text-[2.5rem] sm:text-[2.75rem] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                        : 'text-yellow-400'
                    }`}>
                      <CountUpNumber value={rightStats.total} />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-gray-100 font-serif text-center">
                      {t('musicChart.compare.totalRecordedProductions')}
                    </div>
                    <div className="text-sm text-gray-200 font-sans">
                      <span className="text-yellow-300/80">{t('musicChart.compare.careerTimeline')}</span> {rightStats.yearRange}
                    </div>
                    <div className="text-sm text-gray-200 font-sans">
                      <span className="text-yellow-300/80">{t('musicChart.compare.leadershipProfile')}</span> {rightStats.topRole}
                    </div>
                    <div className="text-sm text-gray-200 font-sans">
                      <span className="text-yellow-300/80">{t('musicChart.compare.signatureWork')}</span> {rightStats.topShow || t('dataTable.unknown')}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center text-gray-100 text-sm font-sans min-h-[120px]">
                    {compareLeft ? t('musicChart.compare.selectAnother') : t('musicChart.compare.chooseToBegin')}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicChart;
