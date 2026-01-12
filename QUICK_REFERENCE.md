# 🚍 BusTracker - Quick Reference

## 🚀 Start Development

### Backend:
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:3000`

### Mobile:
```bash
cd mobile
npx expo start
```
Scan QR code with Expo Go app

---

## 🔑 Configuration Checklist

- [ ] Google Maps API key in `backend/.env`
- [ ] Your IP address in `mobile/src/services/api.ts`
- [ ] Android Maps API key in `mobile/app.json`
- [ ] APIs enabled in Google Cloud Console

---

## 🧪 Quick Tests

### Backend Health:
```bash
curl http://localhost:3000/api/health
```

### Get Route:
```bash
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{"from":"HITEC City, Hyderabad","to":"Charminar"}'
```

---

## 📱 Test Routes in Hyderabad

1. HITEC City → Charminar
2. Secunderabad Station → Gachibowli  
3. Ameerpet → ECIL
4. Banjara Hills → LB Nagar
5. Madhapur → Dilsukhnagar

---

## 🔍 Find Your IP

**Mac:**
```bash
ipconfig getifaddr en0
```

**Windows:**
```bash
ipconfig
```

**Linux:**
```bash
hostname -I
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | Check phone & PC on same WiFi |
| No API key | Add to `backend/.env`, restart server |
| No routes | Use major Hyderabad landmarks |
| Location denied | Enable in phone settings |

---

## 📊 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | API key configuration |
| `mobile/src/services/api.ts` | API endpoint URL |
| `mobile/app.json` | Android Maps API key |
| `SETUP_GUIDE.md` | Detailed setup steps |

---

## 💡 Tips

- Keep backend terminal open to see logs
- Shake phone for Expo dev menu
- Press 'r' in Expo to reload
- Use major landmarks for better results

---

## 📞 Support Links

- [Setup Guide](./SETUP_GUIDE.md)
- [Backend README](./backend/README.md)
- [Project README](./README.md)
- [Completion Guide](./PROJECT_COMPLETE.md)

---

**Remember:** Backend must be running for app to work!

