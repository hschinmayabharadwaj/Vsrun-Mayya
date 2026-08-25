# Quick Start Guide

Get the platform running in under 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 15 with React 19 RC
- TypeScript for type safety
- Tailwind CSS for styling
- Sentry for error tracking
- Three.js for 3D graphics
- Zustand for state management

## 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You'll see:
- Home page with navigation
- "Check Status" page with sample applications
- "New Application" page with OTP verification wizard

## 3. Test the Features

### Check Status Flow
1. Click "Check Status" on the home page
2. See 3 sample applications with different states:
   - **Under Review** (yellow) - Grievance: Service delivery delay
   - **Submitted** (blue) - Application: License renewal  
   - **Approved** (green) - Service Request: Certificate issuance
3. Dev OTP displayed: `123456`

### New Application Flow
1. Click "New Application"
2. Step-by-step wizard:
   - **Step 1**: Enter personal info (name, email, phone)
   - **Step 2**: Select application type and details
   - **Step 3**: Verify with OTP (use: `123456`)
   - **Step 4**: Confirmation with reference ID

## 4. Key Demo Credentials

| Field | Value |
|-------|-------|
| **Demo OTP** | `123456` |
| **Valid for** | 10 minutes |
| **Sample User** | Demo User (demo.user@example.com) |
| **Sample Phone** | +91 DEMO 0000 0001 |

## 5. Test Mobile & Network

### Mobile View
- **Chrome DevTools**: `Ctrl+Shift+M` (or Cmd+Shift+M on Mac)
- Test at **360px width** (primary breakpoint)
- Verify tap targets are ≥44×44px
- Check thumb zone (bottom third of screen)

### Slow 3G Throttling
- **Chrome DevTools** → Network tab → Speed dropdown
- Select **Slow 3G**
- Refresh page and watch loading states

### Keyboard Navigation
- Press `Tab` to navigate through all interactive elements
- Press `Enter` to activate buttons/links
- Press `Escape` to close modals
- Focus indicator should be visible (blue outline)

## 6. Project Structure

```
D:\varun-mayya\
├── app/                        # Next.js App Router
│   ├── page.tsx               # Home page
│   ├── status/page.tsx        # Check status
│   ├── apply/page.tsx         # New application wizard
│   ├── api/status/route.ts    # Mock API endpoint
│   ├── layout.tsx             # Root layout + disclaimer
│   └── globals.css            # Global styles
├── lib/
│   └── mock-data.ts           # Synthetic data (users, apps, notifications)
├── components/                 # (Ready for Stitch screens)
├── public/                     # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── STITCH_INTEGRATION.md      # How to add Stitch screens
```

## 7. Next Steps: Add Stitch Screens

### To integrate screens from Stitch:

1. **Read the guide**: `STITCH_INTEGRATION.md`
2. **Export from Stitch**: https://stitch.withgoogle.com/projects/6350800458773147763
3. **Create component**: Place in `components/screens/`
4. **Create route**: Map to `app/screens/[name]/page.tsx`
5. **Test**: Run `npm run dev` and navigate to the new route

## 8. Build & Deploy

### Local Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 9. Troubleshooting

### Issue: `npm install` fails
**Solution**: Update Node.js to version 18+
```bash
node --version  # Check version
```

### Issue: Port 3000 already in use
**Solution**: Use a different port
```bash
npm run dev -- -p 3001
```

### Issue: Styles not loading
**Solution**: Clear Next.js cache
```bash
rm -rf .next/
npm run dev
```

### Issue: TypeScript errors
**Solution**: Run type check
```bash
npm run type-check
```

## 10. Compliance Checklist

This project is designed to pass the hackathon rubric:

✅ **Accessibility**
- WCAG AA contrast (4.5:1)
- Semantic HTML with ARIA labels
- Keyboard navigation
- Screen reader support
- Min 44×44px tap targets

✅ **Mobile-First**
- Designed for 360px width
- Thumb zone priority
- No hover interactions
- Responsive breakpoints

✅ **Performance**
- Tested on Slow 3G
- Loading states designed
- Minimal bundle size
- Image optimization

✅ **Transparency**
- "Prototype / Demo" disclaimer visible
- Synthetic data clearly labeled
- No official branding misuse
- Demo OTP shown in dev mode

✅ **Architecture**
- Clear separation: UI → API → Data
- Mock API layer (replaceable with real backend)
- Synthetic user data seeded
- State machine for application status

## Support

- **Documentation**: See `README.md` and `STITCH_INTEGRATION.md`
- **Playbook**: See `public_service_hackathon_playbook.md`
- **Code Issues**: TypeScript will flag problems at build time
- **Design Issues**: Test in Chrome DevTools mobile emulation

---

**Ready to start?** Run `npm install && npm run dev` and open http://localhost:3000
