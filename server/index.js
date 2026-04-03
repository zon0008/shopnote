const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock Database
let stores = [
    { id: 'store_1', name: '철수네 베이커리', address: '서울 중구 세종대로', lat: 37.5665, lng: 126.9780, category: '베이커리' }
];

let events = [
    { id: 'event_001', storeId: 'store_1', title: '오늘만 50% 할인!', content: '선착순 20명 반값 할인', isPublished: true },
    { id: 'event_002', storeId: 'store_1', title: '마감 세일', content: '저녁 마감 30% 세일', isPublished: true }
];

let boards = [
    { id: 'board_1', type: 'notice', name: '공지사항' },
    { id: 'board_2', type: 'review', name: '고객 리뷰' }
];

let posts = [];
let inquiries = [];

// --- API Endpoints ---

// 1. App Main API
app.get('/api/main', (req, res) => {
    // Return stores with their published events roughly simulating location search
    const activeEvents = events.filter(e => e.isPublished).map(e => {
        const store = stores.find(s => s.id === e.storeId);
        return { ...e, storeName: store?.name, lat: store?.lat, lng: store?.lng, type: store?.category };
    });
    res.json({ success: true, data: { events: activeEvents } });
});

// 2. Admin APIs
// Store/Address Info
app.get('/api/admin/store', (req, res) => res.json({ success: true, data: stores }));
app.post('/api/admin/store', (req, res) => {
    const newStore = { id: `store_${Date.now()}`, ...req.body };
    stores.push(newStore);
    res.json({ success: true, data: newStore });
});

// Board Management
app.get('/api/admin/boards', (req, res) => res.json({ success: true, data: boards }));

// Inquiries / Reservations
app.get('/api/admin/inquiries', (req, res) => res.json({ success: true, data: inquiries }));

// Serve
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
