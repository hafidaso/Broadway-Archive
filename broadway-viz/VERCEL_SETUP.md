# Vercel Deployment Setup

## Important: Root Directory Configuration

For this project to work correctly on Vercel, you **must** set the **Root Directory** to `broadway-viz` in your Vercel project settings.

### Steps to Configure:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Under **Root Directory**, set it to: `broadway-viz`
4. Save the changes
5. Redeploy your project

### Why This Matters:

- The `vercel.json` file is located in `broadway-viz/`
- The `package.json` and build files are in `broadway-viz/`
- Vercel needs to know where to find these files

### Alternative: If Root Directory is Set to Repository Root

If you cannot change the Root Directory, you can:
1. Move `vercel.json` to the repository root
2. Update the build command in Vercel settings to: `cd broadway-viz && npm run build`
3. Set Output Directory to: `broadway-viz/dist`
