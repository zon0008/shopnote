import { useState, useEffect, useRef } from 'react';
import {
  Store as StoreIcon, ChevronRight, ChevronLeft, CircleOff, Menu, Bell,
  Share2, Home, Search, MessageSquare, User,
  MapPin, Phone, Eye, Calendar, PlusCircle, MessageSquareText,
  X, Camera, Image as ImageIcon, Users, UserCheck
} from 'lucide-react';
import { useAppStore } from '../store';

export default function MobileApp() {
  const { design, stories, inquiryFormFields, addInquiry, addStory, deleteStory } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);
  const [activeBottomMenu, setActiveBottomMenu] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [gpsRadius, setGpsRadius] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isEventExpanded, setIsEventExpanded] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isWritePostModalOpen, setIsWritePostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 200;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const [managementView, setManagementView] = useState<'HOME' | 'CUSTOMERS' | 'RESERVATIONS' | 'STAFF'>('HOME');
  const [isManagementAddModalOpen, setIsManagementAddModalOpen] = useState(false);
  const [managementFormData, setManagementFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerGrade: '일반',
    reservationDate: '',
    reservationStaff: '',
    reservationService: '',
    staffName: '',
    staffRole: ''
  });

  const [storySearchKeyword, setStorySearchKeyword] = useState('');
  const [storySearchType, setStorySearchType] = useState<'제목' | '내용'>('제목');
  const [isSearching, setIsSearching] = useState(false);


  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '단골 고객님',
    email: 'user@example.com',
    phone: '010-1234-5678',
    profileImage: null as string | null
  });

  // 프리미엄 가상 캐릭터 (SVG 아바타) 데이터
  const PREMIUM_AVATARS = [
    { id: 'av1', name: '에메랄드 뮤즈', color: '#00A86B' },
    { id: 'av2', name: '골든 퀸', color: '#FFD700' },
    { id: 'av3', name: '로즈 블라썸', color: '#FF6B6B' },
    { id: 'av4', name: '미드나잇 스타일', color: '#2D3436' },
    { id: 'av5', name: '라벤더 드림', color: '#A29BFE' },
    { id: 'av6', name: '샴페인 골드', color: '#F39C12' }
  ];

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(prev => ({ ...prev, profileImage: reader.result as string }));
        showToast('프로필 이미지가 업로드되었습니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectAvatar = (avatarId: string) => {
    // 실제 운영시에는 서버 URL이나 정해진 SVG 경로를 저장
    // 여기서는 ID 기반으로 식별 가능하게 저장하거나 가상의 URL 생성
    const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${avatarId}&backgroundColor=f1f5f9`;
    setUserProfile(prev => ({ ...prev, profileImage: avatarUrl }));
    showToast(`${PREMIUM_AVATARS.find(a => a.id === avatarId)?.name} 아바타로 변경되었습니다.`);
  };

  const handleManagementAdd = () => {
    // 임시 저장 로직
    console.log('Adding new entry:', managementFormData);
    alert('새 항목이 성공적으로 등록되었습니다.');
    setIsManagementAddModalOpen(false);
    setManagementFormData({
      customerName: '',
      customerPhone: '',
      customerGrade: '일반',
      reservationDate: '',
      reservationStaff: '',
      reservationService: '',
      staffName: '',
      staffRole: ''
    });
  };
  const [userRole, setUserRole] = useState<'USER' | 'DIRECTOR'>('DIRECTOR');
  const [isManagementExpanded, setIsManagementExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-slate-50 relative animate-fade-in font-sans shadow-2xl overflow-hidden">
      {/* App Dynamic Header */}
      <header className="flex items-center justify-between px-4 h-16 bg-gradient-to-r from-[#00A86B] via-[#008B5E] to-[#00704A] sticky top-0 z-[110] shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b-2 border-[#FFD700]/40 overflow-hidden">
        {/* Shine Sweep Animation for Header */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shine-sweep pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <Menu size={24} className="text-white drop-shadow-sm" />
          </button>
        </div>

        <div onClick={() => {
          setStorySearchKeyword('');
          setActiveTab(0);
        }} className="flex-1 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform relative z-10 group">
          {design.logoImage && (
            <div className="relative group/logo">
              {/* Premium 3D Frame Container */}
              <div className="bg-gradient-to-br from-white to-slate-50 p-1.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_4px_8px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.1)] border border-[#FFD700]/60 relative z-20 backdrop-blur-sm transition-all duration-500 group-hover/logo:scale-105 group-hover/logo:shadow-[inset_0_2px_6px_rgba(255,255,255,1),0_8px_20px_rgba(0,0,0,0.35)]">
                <img
                  src={design.logoImage}
                  alt={design.storeName}
                  className="h-10 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-500 brightness-110"
                />

                {/* 3D Glass Gloss Overlay */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl pointer-events-none"></div>
              </div>

              {/* Enhanced Sparkling Aura */}
              <div className="absolute -inset-2 bg-[#FFD700]/30 blur-2xl opacity-40 group-hover/logo:opacity-70 transition-opacity duration-700 rounded-full z-10 animate-pulse-gentle"></div>

              {/* Extra Sparkle Dots (Optional/Premium feel) */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFD700] rounded-full blur-[1px] animate-pulse z-30"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#FFF] rounded-full blur-[1px] animate-bounce z-30 opacity-60" style={{ animationDuration: '3s' }}></div>
            </div>
          )}
          <span className="font-black text-[28px] tracking-[0.1em] bg-clip-text text-transparent bg-gradient-to-b from-[#FFF] via-[#FFD700] to-[#B8860B] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-none select-none pt-1 drop-shadow-white group-hover:scale-105 transition-transform duration-300 [-webkit-text-stroke:0.8px_rgba(139,101,8,0.3)]">
            네일 블리스
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationOpen(true);
            }}
            className="p-1 hover:bg-white/10 rounded-full transition-colors relative"
          >
            <Bell size={24} className="text-white drop-shadow-sm" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFD700] rounded-full border border-emerald-600"></span>
          </button>
        </div>
      </header>
      {/* Notice Banner */}
      <div className="flex items-center px-4 py-2.5 shadow-sm relative z-0" style={{ backgroundColor: '#fff8f1' }}>
        <span className="font-bold text-[10px] mr-2 shrink-0 border px-1.5 py-0.5 rounded shadow-sm" style={{ color: design.themeColor, borderColor: design.themeColor }}>공지</span>
        <span className="text-xs text-slate-700 truncate flex-1 font-medium">{design.noticeText}</span>
      </div>

      {/* Content View Switching based on Bottom Menu */}
      {activeBottomMenu === 0 ? (
        <>
          {/* Tabs */}
          <div className="flex shadow-sm bg-white overflow-x-auto border-b-2 shrink-0 z-10" style={{ borderBottomColor: `${design.themeColor}30` }}>
            {design.headerMenus.map((menu, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 min-w-[80px] py-3 text-center text-[13px] font-extrabold truncate px-1 transition-colors duration-300 ${activeTab === i ? 'shadow-inner' : ''}`}
                style={{
                  backgroundColor: activeTab === i ? design.themeColor : 'transparent',
                  color: activeTab === i ? 'white' : '#64748b'
                }}
              >
                {menu}
              </button>
            ))}
          </div>

          {/* Main Content View (Home) */}
          <div className="flex-1 overflow-y-auto pb-20">
            {activeTab === 0 ? (
              <div className="animate-fade-in">
                {/* Hero Image */}
                <div className="h-56 bg-slate-200 relative group overflow-hidden">
                  <img src={design.bannerImages[0] || 'https://images.unsplash.com/photo-1542314831-c6a4ca2cd9c5?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="banner" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm w-max mb-2 shadow-sm" style={{ backgroundColor: design.themeColor }}>인기 예약</span>
                    <h2 className="text-white font-extrabold text-2xl leading-tight text-shadow-sm mb-1">
                      환영합니다!<br />{design.storeName}입니다.
                    </h2>
                    <p className="text-slate-200 text-sm font-semibold">최고의 서비스를 고객님께 경험시켜 드릴게요.</p>
                  </div>
                </div>

                {/* Store Info and Quick Actions (matching image 1) */}
                <div className="bg-white border-b border-slate-100 flex flex-col relative z-0">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 tracking-tight">{design.address}</span>
                      <span className="text-sm font-medium text-slate-500 mt-0.5">전화 : {design.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setIsMapModalOpen(true)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl active:scale-95 transition-transform shadow-sm text-slate-600 hover:text-slate-800"><MapPin size={22} /></button>
                      <a href={`tel:${design.phone}`} className="p-3 bg-slate-50 border border-slate-200 rounded-xl active:scale-95 transition-transform shadow-sm text-slate-600 hover:text-slate-800"><Phone size={22} /></a>
                    </div>
                  </div>
                </div>

                {/* 🚀 New Management Features Section (Foldable & Restricted to Directors) */}
                {userRole === 'DIRECTOR' && (
                  <div className="bg-white border-b border-slate-100 mt-2">
                    <button
                      onClick={() => setIsManagementExpanded(!isManagementExpanded)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-b border-slate-100"
                    >
                      <span className="font-extrabold text-[15px] text-slate-800 flex items-center gap-1.5">
                        <StoreIcon size={16} className="text-blue-500" />
                        가맹점 통합 관리 시스템 (이사전용)
                      </span>
                      <ChevronRight size={18} className={`text-slate-400 transition-transform duration-300 ${isManagementExpanded ? 'rotate-90' : 'rotate-0'}`} />
                    </button>

                    <div className={`transition-all duration-300 overflow-hidden ${isManagementExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5">
                        <div className="grid grid-cols-3 gap-3">
                          <button onClick={() => setManagementView('CUSTOMERS')} className="flex flex-col items-center text-center active:scale-95 transition-transform group cursor-pointer outline-none ring-0">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100/50 group-hover:bg-blue-100 transition-colors">
                              <Users size={28} className="text-blue-500" />
                            </div>
                            <h4 className="text-[13px] font-black text-slate-800 mb-1.5 leading-tight">고객관리</h4>
                            <p className="text-[9px] text-slate-400 font-bold leading-relaxed px-1">체계적이고 세심한<br />고객관리 서비스!</p>
                          </button>
                          <button onClick={() => setManagementView('RESERVATIONS')} className="flex flex-col items-center text-center active:scale-95 transition-transform group cursor-pointer outline-none ring-0">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100/50 group-hover:bg-blue-100 transition-colors">
                              <Calendar size={28} className="text-blue-500" />
                            </div>
                            <h4 className="text-[13px] font-black text-slate-800 mb-1.5 leading-tight">예약관리</h4>
                            <p className="text-[9px] text-slate-400 font-bold leading-relaxed px-1">샵 맞춤형으로<br />예약을 관리하세요!</p>
                          </button>
                          <button onClick={() => setManagementView('STAFF')} className="flex flex-col items-center text-center active:scale-95 transition-transform group cursor-pointer outline-none ring-0">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100/50 group-hover:bg-blue-100 transition-colors">
                              <UserCheck size={28} className="text-blue-500" />
                            </div>
                            <h4 className="text-[13px] font-black text-slate-800 mb-1.5 leading-tight">직원관리</h4>
                            <p className="text-[9px] text-slate-400 font-bold leading-relaxed px-1">근태, 급여부터<br />인센티브 자동관리!</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* GPS Event Filter */}
                {/* GPS Event Filter */}
                <div className="bg-white border-b border-slate-100 mt-2">
                  <button
                    onClick={() => setIsEventExpanded(!isEventExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer outline-none"
                  >
                    <span className="font-extrabold text-[15px] text-slate-800 flex items-center gap-1.5">
                      <MapPin size={16} className="text-rose-500" />
                      내 주변 핫딜/이벤트 탐색
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded shadow-inner border border-slate-200">
                        현재 반경: <span className="text-rose-500">{gpsRadius}km</span>
                      </span>
                      <ChevronRight size={18} className={`text-slate-400 transition-transform duration-300 ${isEventExpanded ? 'rotate-90' : 'rotate-0'}`} />
                    </div>
                  </button>

                  <div className={`transition-all duration-300 overflow-hidden ${isEventExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4">

                      {/* Distance Selector Slider/Tabs */}
                      <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-inner mb-3 relative z-0">
                        {[1, 3, 5, 10].map(dist => (
                          <button
                            key={dist}
                            onClick={() => setGpsRadius(dist)}
                            className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all z-10 ${gpsRadius === dist ? 'bg-white shadow-sm text-rose-500 border border-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'}`}
                          >
                            {dist}km
                          </button>
                        ))}
                      </div>

                      {/* Category Selector */}
                      <div className="flex overflow-x-auto gap-1.5 pb-3 scrollbar-hide">
                        {['전체', '공구/도구', '염료/약품', '음식점', '제과제빵', '마트/편의점', '숙박/모텔', '뷰티/미용', '펫샵', '학원', '골프', '헬스/필라테스', '가전렌탈', '세차/정비', '렌트카', '보험/재무컨설팅', '생활/서비스'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${activeCategory === cat ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 relative'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Mock Event List based on GPS */}
                      <div className="space-y-2.5">
                        {[
                          { category: '마트/편의점', type: '핫딜', d: 0.4, title: '식자재 마트 오픈 타임세일 반값', sub: '선착순 30명 랜덤박스 증정', discount: '50%' },
                          { category: '뷰티/미용', type: '이벤트', d: 0.8, title: '뷰티샵 신규오픈 전품목 할인', sub: '사전예약시 추가 사은품 증정', discount: '30%' },
                          { category: '음식점', type: '핫딜', d: 0.3, title: '스테이크 하우스 런치 특선 반값', sub: '오후 2시 이전 방문 시 와인 1잔 무료', discount: '20%' },
                          { category: '숙박/모텔', type: '이벤트', d: 0.9, title: '프리미엄 모텔 주말 무한대실', sub: '선착순 예약시 넷플릭스 룸 배정', discount: '15%' },
                          { category: '제과제빵', type: '핫딜', d: 0.2, title: '유기농 베이커리 전품목 10%할인', sub: '오픈 기념 선착순 쿠폰 발급', discount: '10%' },
                          { category: '펫샵', type: '이벤트', d: 0.5, title: '프리미엄 수제간식 1+1 이벤트', sub: '회원가입 시 배변패드 추가 증정', discount: '1+1' },
                          { category: '학원', type: '이벤트', d: 0.7, title: '영어학원 겨울방학 특강 모집', sub: '조기 등록 시 교재비 면제', discount: 'Free' },
                          { category: '헬스/필라테스', type: '핫딜', d: 1.1, title: '기구 필라테스 그룹레슨 초특가', sub: '신규 등록 시 요가복 증정 (한정수량)', discount: '40%' },
                          { category: '가전렌탈', type: '이벤트', d: 1.5, title: '최신 공기청정기/정수기 렌탈', sub: '첫 달 렌탈료 무료 및 설치비 지원', discount: '무료' },
                          { category: '세차/정비', type: '핫딜', d: 0.6, title: '세라믹 코팅 세차 1+1', sub: '동시 예약 진행 시 1대 무료', discount: '50%' },
                          { category: '보험/재무컨설팅', type: '이벤트', d: 1.2, title: '내 보험 다나와 1:1 진단 컨설팅', sub: '상담 완료 시 스타벅스 기프티콘 증정', discount: '쿠폰' }
                        ].filter(item => activeCategory === '전체' || item.category === activeCategory).map((item, idx) => (
                          <div key={idx} onClick={() => showToast(`${parseFloat((item.d * gpsRadius).toFixed(1))}km 내 매장으로 이동합니다.`)} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm items-center hover:border-slate-300 hover:shadow-md active:scale-95 transition-all cursor-pointer">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm relative">
                              <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[10px] font-black px-1.5 py-0.5 rounded-br-lg z-10">{item.discount}</div>
                              <img src={`https://images.unsplash.com/photo-${1500000000000 + idx * 5000000}?w=200&q=80`} className="w-full h-full object-cover" alt="event" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-0.5">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${item.type === '핫딜' ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-primary/10 text-primary border border-primary/20'}`}>{item.type}</span>
                                <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-0.5"><MapPin size={10} /> {parseFloat((item.d * gpsRadius).toFixed(1))}km 매장</span>
                              </div>
                              <h4 className="font-extrabold text-[13px] text-slate-800 line-clamp-1 leading-snug tracking-tight">[{item.category}] {item.title}</h4>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-[10px] text-slate-500 font-bold tracking-tight truncate flex-1">{item.sub}</p>
                                {item.type === '핫딜' && (
                                  <span className="text-[10px] font-black text-rose-500 flex items-center gap-0.5 shrink-0 bg-rose-50 px-1.5 py-0.5 rounded shadow-sm border border-rose-100">
                                    마감 {formatTime(timeLeft - (idx * 300))}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 📝 명소 List (matching image 1) */}
                <div className="p-4 mt-3 bg-white border-y border-slate-100">
                  <div className="flex items-center justify-between mb-3"><span className="font-extrabold text-[15px] text-slate-800 flex items-center gap-1.5"><StoreIcon size={16} style={{ color: design.themeColor }} /> {design.attractionsTitle || '명소'}</span><button className="text-xs font-bold text-slate-400 flex items-center active:scale-95" onClick={() => showToast('더보기 서비스 준비 중')}>+ 더보기</button></div>
                  <div className="grid grid-cols-2 gap-3">
                    {(design.attractions || []).map((item) => (
                      <button key={item.id} onClick={() => setZoomedImage(item.image)} className="bg-white border border-slate-100 rounded-lg overflow-hidden group active:scale-95 transition-transform text-left p-1 shadow-sm">
                        <div className="h-[90px] bg-slate-200 overflow-hidden rounded"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="product" /></div>
                        <div className="p-2 text-xs font-bold text-slate-700 truncate">{item.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 1 ? (
              <div className="animate-fade-in bg-slate-50 min-h-full pb-10">
                {/* Board header / search */}
                <div className="bg-slate-200 p-2 flex gap-2 items-center">
                  <select
                    value={storySearchType}
                    onChange={(e) => setStorySearchType(e.target.value as '제목' | '내용')}
                    className="bg-white border border-gray-300 text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="제목">제목</option>
                    <option value="내용">내용</option>
                  </select>
                  <input
                    type="text"
                    value={storySearchKeyword}
                    onChange={(e) => setStorySearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsSearching(!isSearching)}
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    placeholder="검색어를 입력하세요"
                  />
                  <button
                    onClick={() => setIsSearching(!isSearching)}
                    className="px-4 py-1.5 text-xs bg-slate-600 active:bg-slate-700 text-white rounded font-bold transition-colors shadow-sm"
                  >
                    검색
                  </button>
                </div>
                {/* Board Content (Gallery Style) */}
                <div className="p-3 bg-white divide-y divide-slate-100">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 py-1 font-medium">
                    <span>
                      {stories.filter(post => {
                        if (!storySearchKeyword.trim()) return true;
                        if (storySearchType === '제목') return post.title.includes(storySearchKeyword);
                        return post.content.includes(storySearchKeyword);
                      }).length}개 게시물
                    </span>
                    <button onClick={() => setIsWritePostModalOpen(true)} className="border border-slate-200 px-2 py-1 rounded-sm bg-slate-50 text-slate-500 flex items-center gap-1 active:scale-95 text-[10px] font-bold shadow-sm">
                      새 글 쓰기 <PlusCircle size={10} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    {stories
                      .filter(post => {
                        if (!storySearchKeyword.trim()) return true;
                        if (storySearchType === '제목') return post.title.includes(storySearchKeyword);
                        return post.content.includes(storySearchKeyword);
                      })
                      .map((post, idx) => (
                        <div
                          key={post.id}
                          onClick={() => post.img && setZoomedImage(post.img)}
                          className="border border-slate-100 rounded bg-white overflow-hidden shadow-sm flex flex-col cursor-pointer hover:border-primary/50 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                          {post.img && (
                            <div className="h-[110px] bg-slate-100 overflow-hidden relative group">
                              {idx === 0 && !storySearchKeyword && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold z-10 shadow-sm border border-red-600">new</span>
                              )}
                              {userRole === 'DIRECTOR' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
                                      deleteStory(post.id);
                                      showToast('게시물이 삭제되었습니다.');
                                    }
                                  }}
                                  className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full z-20 transition-colors shadow-lg"
                                  title="삭제"
                                >
                                  <X size={12} />
                                </button>
                              )}
                              <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={post.title} />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                          )}
                          <div className="p-2.5 flex-1 flex flex-col justify-between relative group">
                            {!post.img && userRole === 'DIRECTOR' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
                                    deleteStory(post.id);
                                    showToast('게시물이 삭제되었습니다.');
                                  }
                                }}
                                className="absolute top-2 right-2 bg-black/10 hover:bg-red-500 hover:text-white text-slate-400 hover:text-white p-1 rounded-full z-20 transition-colors"
                                title="삭제"
                              >
                                <X size={12} />
                              </button>
                            )}
                            <h3 className="font-extrabold text-slate-800 text-xs mb-1.5 line-clamp-2 leading-snug">{post.title}</h3>
                            <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold mt-2 pt-2 border-t border-slate-50">
                              <span className="flex items-center gap-1"><MessageSquareText size={10} /> {idx + 1}</span>
                              <span className="flex items-center gap-1"><Eye size={12} /> {201 - idx}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    {stories.filter(post => {
                      if (!storySearchKeyword.trim()) return true;
                      if (storySearchType === '제목') return post.title.includes(storySearchKeyword);
                      return post.content.includes(storySearchKeyword);
                    }).length === 0 && (
                        <div className="col-span-2 py-20 text-center text-slate-400">
                          <CircleOff size={40} className="mx-auto mb-3 opacity-20" />
                          <p className="text-xs font-bold">검색 결과가 없습니다.</p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ) : activeTab === 2 ? (
              <div className="animate-fade-in bg-slate-50 min-h-full pb-10">
                {/* Premium Marketing Banner */}
                <div className="h-[180px] relative overflow-hidden group shadow-lg">
                  <img
                    src="/assets/images/nail_inquiry_banner.png"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    alt="Inquiry Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-black/20 flex flex-col justify-end p-6">
                    <div className="animate-bounce-subtle">
                      <span className="bg-[#FFD700] text-emerald-900 px-2.5 py-0.5 text-[10px] font-black rounded-sm shadow-lg inline-block tracking-wider mb-2 uppercase">Special Opening Event</span>
                    </div>
                    <h3 className="font-black text-2xl tracking-tighter text-white drop-shadow-lg font-serif">
                      최상위 1% 마스터의 손길,<br />
                      <span className="text-[#FFD700]">{design.storeName}</span>에서 시작하세요
                    </h3>
                    <p className="text-white/80 text-[11px] font-bold mt-2 flex items-center gap-1.5 backdrop-blur-sm bg-black/20 w-fit px-2 py-1 rounded">
                      <Calendar size={12} className="text-[#FFD700]" /> 쉽고 빠른 1:1 맞춤 예약 시스템
                    </p>
                  </div>
                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 blur-3xl rounded-full"></div>
                </div>

                {/* Premium Benefits Section */}
                <div className="px-4 py-6 bg-white border-b border-slate-100 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2 border border-emerald-100">
                      <UserCheck size={20} className="text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800">1:1 프라이빗</span>
                    <p className="text-[8px] text-slate-400 mt-0.5">완벽한 맞춤 케어</p>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-slate-50">
                    <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center mb-2 border border-gold-100" style={{ backgroundColor: `${design.themeColor}10` }}>
                      <ImageIcon size={20} style={{ color: design.themeColor }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-800">최신 트렌드</span>
                    <p className="text-[8px] text-slate-400 mt-0.5">매주 새로운 아트</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 border border-blue-100">
                      <Bell size={20} className="text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800">클린&안전</span>
                    <p className="text-[8px] text-slate-400 mt-0.5">철저한 멸균 관리</p>
                  </div>
                </div>

                {/* Inspirational Gallery (Marketing Gallery) */}
                <div className="py-5 bg-white border-b border-slate-100 overflow-hidden">
                  <div className="px-4 mb-3 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <PlusCircle size={14} className="text-emerald-600" /> Inspired Masterpieces
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 italic">Sweep Right to Explore</span>
                  </div>
                  <div className="relative group/gallery">
                    <div
                      ref={galleryRef}
                      className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth"
                    >
                      {stories.slice(0, 5).map((story, i) => (
                        <div key={i} className="shrink-0 w-32 h-40 rounded-xl overflow-hidden relative shadow-md border border-slate-100 group cursor-pointer" onClick={() => setZoomedImage(story.img)}>
                          <img src={story.img} alt="art" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2">
                            <span className="text-[9px] text-white font-bold line-clamp-1 opacity-90">{story.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Rolling Arrows */}
                    <button
                      onClick={() => scrollGallery('left')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all opacity-0 group-hover/gallery:opacity-100 z-20"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollGallery('right')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all opacity-0 group-hover/gallery:opacity-100 z-20"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Inquire Form */}
                <div className="mt-2 bg-white border-y border-slate-100 shadow-sm relative overflow-hidden">
                  {/* Subtle Background Accent */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full opacity-30 blur-2xl"></div>

                  <div className="px-4 py-4 border-b border-slate-50 relative z-10 flex items-center justify-between">
                    <div>
                      <h4 className="text-[14px] font-black text-slate-800 tracking-tight">상담 및 예약 신청서</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 italic">전문 상담원이 확인 후 직접 연락 드립니다.</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-[9px] font-black border border-emerald-100 flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div> 실시간 접수 중
                    </div>
                  </div>

                  <div className="p-0 text-sm flex flex-col relative z-10">
                    {inquiryFormFields.map((field, idx) => (
                      <div key={idx} className="flex border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <label className="w-20 py-4 px-4 text-[11px] font-black text-slate-500 flex items-center border-r border-slate-50 shrink-0">{field}</label>
                        <div className="flex-1 py-1.5 px-3 flex items-center">
                          {field === '내용' ? (
                            <textarea
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all h-28 resize-none shadow-sm"
                              placeholder="원하시는 스타일이나 궁금하신 점을 자유롭게 입력해 주세요."
                              value={formData[field] || ''}
                              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            />
                          ) : (
                            <input
                              type="text"
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all shadow-sm"
                              placeholder={`${field}${field === '날짜' ? ' (예: 05/20 14:00)' : ' 입력'}`}
                              value={formData[field] || ''}
                              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="p-5 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-4 px-1">
                        <input type="checkbox" id="privacy" className="accent-emerald-600" defaultChecked />
                        <label htmlFor="privacy" className="text-[10px] text-slate-500 font-bold hover:text-slate-800 cursor-pointer">개인정보 수집 및 이용에 동의합니다. (필수)</label>
                      </div>
                      <button
                        onClick={() => { addInquiry({ fields: formData }); setFormData({}); showToast('성공적으로 접수되었습니다! 예약 확정 문자를 기다려 주세요.'); }}
                        className="group w-full py-4 text-white font-black text-[14px] rounded-xl active:scale-95 transition-all shadow-lg hover:shadow-emerald-900/20 cursor-pointer tracking-[0.1em] relative overflow-hidden"
                        style={{ backgroundColor: design.themeColor }}>
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        PREMIUM RESERVATION 예약하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 3 ? (
              <div className="animate-fade-in bg-white min-h-full h-full pb-20 overflow-y-auto no-scrollbar">
                {/* Visual Map Area */}
                <div className="relative w-full h-[45vh] overflow-hidden">
                  {/* Premium Styled Map Placeholder */}
                  <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0.5px,_transparent_0.5px)] bg-[length:24px_24px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 to-transparent"></div>

                    {/* Simulated Map Arteries (Gangnam Feel) */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 rotate-[-5deg]"></div>
                    <div className="absolute top-0 left-1/3 w-1 h-full bg-white/5 rotate-[15deg]"></div>
                    <div className="absolute bottom-1/4 right-0 w-full h-0.5 bg-white/5"></div>
                  </div>

                  {/* High-End Marker System */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 rounded-full animate-ping-slow"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-500/40 rounded-full animate-pulse-slow"></div>

                      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl shadow-2xl animate-bounce-gentle">
                        <div className="bg-white rounded-xl p-1 shadow-inner">
                          <img src={design.logoUrl} alt="logo" className="w-8 h-8 object-contain" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Float Card */}
                  <div className="absolute bottom-6 left-4 right-4 z-30">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-black text-slate-800">{design.storeName}</span>
                          <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse">OPEN NOW</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight">{design.address}</p>
                      </div>
                      <button
                        onClick={() => { navigator.clipboard.writeText(design.address); showToast('주소가 복사되었습니다.'); }}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl active:scale-90 transition-all border border-emerald-100/50"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Time */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-black text-slate-400 group-hover:text-emerald-700">영업시간</span>
                      </div>
                      <div className="text-[13px] font-black text-slate-700">09:00 - 21:00</div>
                      <div className="text-[9px] font-bold text-slate-400 mt-0.5">매주 월요일 정기 휴무</div>
                    </div>

                    {/* Contact */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group" onClick={() => window.location.href = 'tel:010-6321-0141'}>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-black text-slate-400 group-hover:text-emerald-700">전화번호</span>
                      </div>
                      <div className="text-[13px] font-black text-slate-700 tracking-wider">010-6321-0141</div>
                      <div className="text-[9px] font-bold text-slate-400 mt-0.5 italic underline group-hover:text-emerald-500">클릭하면 바로 연결</div>
                    </div>

                    {/* Parking */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-black text-slate-400">주차안내</span>
                      </div>
                      <div className="text-[13px] font-black text-slate-700 leading-tight">건물 지하 1-3층</div>
                      <div className="text-[9px] font-bold text-slate-400 mt-0.5 italic">무료 주차 2시간 지원</div>
                    </div>

                    {/* Transport */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-black text-slate-400">오시는 길</span>
                      </div>
                      <div className="text-[13px] font-black text-slate-700 leading-tight">강남역 12번 출구</div>
                      <div className="text-[9px] font-bold text-slate-400 mt-0.5 italic">도보 약 200m (3분 소요)</div>
                    </div>
                  </div>

                  {/* Navigation External Links */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest px-1">Navigation Apps</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => showToast('네이버 지도 길찾기를 실행합니다.')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 hover:bg-emerald-50/30 active:scale-95 transition-all">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-[10px] font-black text-white">N</div>
                        <span className="text-[10px] font-black text-slate-600 uppercase">Naver</span>
                      </button>
                      <button onClick={() => showToast('카카오맵 길찾기를 실행합니다.')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 hover:bg-yellow-50/30 active:scale-95 transition-all">
                        <div className="w-8 h-8 bg-[#FEE500] rounded-lg flex items-center justify-center text-[10px] font-black text-[#3C1E1E]">K</div>
                        <span className="text-[10px] font-black text-slate-600 uppercase">Kakao</span>
                      </button>
                      <button onClick={() => showToast('티맵 길찾기를 실행합니다.')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 hover:bg-slate-100 active:scale-95 transition-all">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white italic">T</div>
                        <span className="text-[10px] font-black text-slate-600 uppercase">T Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 px-8 text-center animate-fade-in pb-20">
                <CircleOff size={48} className="mb-4 opacity-20" style={{ color: design.themeColor }} />
                <p className="font-bold text-slate-600 mb-2">{design.headerMenus[activeTab] || '준비중'} 탭입니다.</p>
                <p className="text-sm">입력된 데이터가 없거나 준비 중입니다.</p>
              </div>
            )}
          </div>
        </>
      ) : activeBottomMenu === 1 ? (
        <div className="flex-1 overflow-y-auto pb-20 animate-fade-in bg-white">
          <div className="p-5">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">검색</h2>
            <div className="relative">
              <input type="text" placeholder="검색어를 입력하세요" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-300 transition-colors" />
              <Search className="absolute right-4 top-3.5 text-slate-400 cursor-pointer" size={20} />
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.themeColor }}></div> 인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {['최신 메뉴', '이벤트 안내', '예약 관련', '매장 위치', '할인 쿠폰'].map((keyword, i) => (
                  <span key={i} className="px-3.5 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold active:scale-95 cursor-pointer hover:bg-slate-100 transition-colors">{keyword}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeBottomMenu === 2 ? (
        <div className="flex-1 overflow-y-auto pb-20 animate-fade-in bg-slate-50">
          <div className="p-5">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">채팅 상담</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center h-[300px] flex flex-col items-center justify-center">
              <MessageSquare size={48} className="text-slate-200 mb-4" />
              <p className="font-extrabold text-slate-600 mb-1 text-lg">상담 대기 중</p>
              <p className="text-xs text-slate-400 mb-5 max-w-[200px]">고객센터 영업시간 내 접수 시 담당자가 직접 답변해 드립니다.</p>
              <button onClick={() => window.open('https://open.kakao.com', '_blank')} className="px-6 py-3 text-white font-bold text-[13px] rounded-xl active:scale-95 transition-transform shadow-md cursor-pointer" style={{ backgroundColor: design.themeColor }}>새 채팅 시작하기</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-20 animate-fade-in bg-slate-50">
          <div className="p-5">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">마이 페이지</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400"><User size={28} /></div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 text-lg mb-0.5">{userProfile.name}</h3>
                <p className="text-[13px] text-slate-400 font-bold">{design.storeName} 회원</p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold rounded-lg transition-colors cursor-pointer active:scale-95"
              >
                프로필 변경
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
              {['히스토리/주문 내역', '찜한 관심목록', '내가 작성한 리뷰', '개인정보 설정', '로그아웃'].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (item === '히스토리/주문 내역') {
                      showToast('최근 3개월 내 주문 내역이 2건 있습니다.');
                    } else if (item === '찜한 관심목록') {
                      showToast('Emerald Gold 아트 외 1건이 찜 목록에 있습니다.');
                    } else {
                      showToast(`${item} 기능은 준비 중입니다.`);
                    }
                  }}
                  className="w-full text-left px-5 py-4 text-[13px] font-bold text-slate-700 flex justify-between items-center bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
                >
                  {item} <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )
      }

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full h-[68px] bg-white border-t border-slate-100 flex justify-around items-center px-2 z-20 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        {design.bottomMenus.map((menu, i) => {
          const icons = [<Home size={22} />, <Search size={22} />, <MessageSquare size={22} />, <User size={22} />];
          return (
            <button key={i} onClick={() => setActiveBottomMenu(i)} className={`flex flex-col items-center justify-center w-16 h-full transition-colors active:scale-95 cursor-pointer ${activeBottomMenu === i ? 'font-extrabold' : 'font-medium text-slate-400'}`} style={{ color: activeBottomMenu === i ? design.themeColor : undefined }}>
              <div className={`mb-1 transition-transform ${activeBottomMenu === i ? '-translate-y-0.5' : ''}`}>{icons[i % 4]}</div>
              <span className="text-[10px] tracking-tight">{menu}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      {
        toastMessage && (
          <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-bold animate-fade-in z-50 whitespace-nowrap">
            {toastMessage}
          </div>
        )
      }

      {/* Sidebar Drawer */}
      {
        isSidebarOpen && (
          <div className="absolute inset-0 z-50 flex animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="w-64 bg-[#6b584d] h-full relative shadow-2xl flex flex-col z-10 animate-[slide-in-right_0.3s_ease-out]">
              {/* Profile Header */}
              <div className="bg-[#5c4a40] text-amber-50 p-5 border-b border-white/10 flex flex-col gap-3 relative pt-12">
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white active:scale-95 cursor-pointer p-1">✕</button>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden relative group">
                  {userProfile.profileImage ? (
                    <img src={userProfile.profileImage} className="w-full h-full object-cover" alt="profile" />
                  ) : (
                    <User size={28} className="opacity-80" />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => { setIsSidebarOpen(false); setIsProfileModalOpen(true); }}>
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-extrabold text-base tracking-tight">{design.storeName}</p>
                  <p className="text-[11px] text-amber-200/70 mt-1 leading-snug tracking-tighter">당신만의 휴식처를 이 곳에서 찾다.<br />최고의 서비스를 만나보세요.</p>
                </div>
              </div>
              {/* Native-style Menu List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 bg-[#5c4a40]/50 text-[10px] font-bold text-amber-100/40 uppercase tracking-widest border-b border-white/5">메뉴 설정</div>
                {['로그인', '공지', '게시판', 'SNS 공감', '이벤트', '쿠폰/할인', '예약내역', '업체정보'].map((item, i) => {
                  const sIcons = [<User size={14} />, <Bell size={14} />, <StoreIcon size={14} />, <Share2 size={14} />, <Calendar size={14} />, <PlusCircle size={14} />, <Calendar size={14} />, <StoreIcon size={14} />];
                  return (
                    <button key={i} onClick={() => {
                      setIsSidebarOpen(false);
                      if (item === '공지' || item === '게시판') {
                        setActiveBottomMenu(0); setActiveTab(1);
                      } else if (item === '이벤트' || item === '쿠폰/할인' || item === '업체정보') {
                        setActiveBottomMenu(0); setActiveTab(0); setIsEventExpanded(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (item === '로그인' || item === '예약내역') {
                        setActiveBottomMenu(3);
                      } else {
                        showToast(`${item} 기능은 준비 중입니다.`);
                      }
                    }} className="w-full text-left px-5 py-3 relative text-[13px] font-bold text-amber-50 hover:bg-white/10 active:bg-white/20 transition-colors flex items-center justify-between border-b border-white/5 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-amber-200/50">{sIcons[i % sIcons.length]}</div>
                        {item}
                      </div>
                      <ChevronRight size={14} className="opacity-30" />
                    </button>
                  )
                })}
              </div>

              {/* Homepage Links */}
              <div className="px-5 py-4 bg-[#5c4a40]/30 border-t border-white/5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    window.open('/#/hq', '_blank');
                  }}
                  className="w-full text-left px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-amber-50 text-[12px] font-bold flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> 본사 홈페이지</div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
                <button
                  onClick={() => {
                    showToast('해당 가맹점(지점)에 할당된 홈페이지 주소가 아직 없습니다.');
                  }}
                  className="w-full text-left px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-amber-50 text-[12px] font-bold flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/80"></div> 지점 홈페이지</div>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              </div>

              {/* Business Info */}
              <div className="px-5 py-4 bg-[#4a3b33] text-amber-100/40 text-[10px] space-y-1.5 border-t border-white/5 pb-6">
                <p className="font-bold text-amber-50/70 mb-2">사업자 정보</p>
                <p>상호: {design.businessName} | 대표: {design.ceoName}</p>
                <p>사업자등록번호: {design.bizNumber}</p>
                <p>전화: {design.phone} | 이메일: {design.email}</p>
              </div>

              {/* Bottom SNS Bar */}
              <div className="p-4 bg-[#5c4a40] flex gap-4 lg:gap-3 justify-center border-t border-white/10 shrink-0 shadow-inner relative z-20">
                <button onClick={() => window.open('https://pf.kakao.com', '_blank')} className="w-10 h-10 rounded-lg bg-[#FAE100] text-[#3b1e1e] flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-transform">
                  <MessageSquareText size={20} fill="currentColor" />
                </button>
                <button onClick={() => window.open('https://facebook.com', '_blank')} className="w-10 h-10 rounded-lg bg-[#4267B2] text-white flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-transform">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" /></svg>
                </button>
                <button onClick={() => window.open('https://twitter.com', '_blank')} className="w-10 h-10 rounded-lg bg-[#1DA1F2] text-white flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-transform">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" /></svg>
                </button>
              </div>

              {/* Policy Quick Links */}
              <div className="px-5 py-4 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-amber-200/30">
                <button onClick={() => showToast('개인정보처리방침: 고객님의 데이터를 안전하게 보호합니다.')} className="hover:text-amber-200 transition-colors">Privacy Policy</button>
                <button onClick={() => showToast('이용약관: 네일블리스 플랫폼 이용 수칙입니다.')} className="hover:text-amber-200 transition-colors">Terms</button>
                <button onClick={() => showToast('가맹문의: 010-XXXX-XXXX')} className="hover:text-amber-200 transition-colors">Contact HQ</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Notification Drawer (Bell) */}
      {
        isNotificationOpen && (
          <div className="absolute inset-0 z-50 flex animate-fade-in justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer" onClick={() => setIsNotificationOpen(false)}></div>
            <div className="w-72 bg-slate-50 h-full relative shadow-2xl flex flex-col z-10 animate-[slide-in-left_0.3s_ease-out]">
              <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><Bell size={18} className="text-rose-500" /> 새 소식 알림</h3>
                <button onClick={() => setIsNotificationOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-95 transition-transform cursor-pointer"><CircleOff size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div onClick={() => { setIsNotificationOpen(false); setActiveBottomMenu(0); setActiveTab(1); }} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-slate-300 active:scale-[0.98] transition-all">
                  <span className="text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded shadow-sm mb-1.5 inline-block">스토리</span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1 mb-0.5">[{design.storeName}] 리뷰를 남겨주세요!</p>
                  <p className="text-[10px] text-slate-400">2시간 전</p>
                </div>
                <div onClick={() => { setIsNotificationOpen(false); setActiveBottomMenu(0); setActiveTab(0); setIsEventExpanded(true); }} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-rose-300 active:scale-[0.98] transition-all">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded shadow-sm mb-1.5 inline-block">핫딜 이벤트</span>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1 mb-0.5">50% 반값 타임세일 시작 🎉</p>
                  <p className="text-[10px] text-slate-400">1일 전</p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 text-slate-400 h-32 opacity-50">
                  <p className="text-[10px] font-bold">이전 알림이 없습니다</p>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
                <button onClick={() => setIsNotificationOpen(false)} className="text-[11px] font-bold text-slate-500 hover:text-slate-700 underline underline-offset-2 cursor-pointer">모두 읽음 처리</button>
              </div>
            </div>
          </div>
        )
      }
      {/* Map Modal */}
      {
        isMapModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsMapModalOpen(false)}></div>
            <div className="w-full bg-white rounded-2xl relative shadow-2xl z-10 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-800 text-[15px] flex items-center gap-2"><MapPin size={16} style={{ color: design.themeColor }} /> 매장 오시는 길</h3>
                <button onClick={() => setIsMapModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"><X size={20} /></button>
              </div>
              <div className="w-full h-[300px] bg-slate-200 relative shrink-0">
                {/* Dummy Map UI representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format')] bg-cover bg-center"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <MapPin size={40} className="text-rose-500 drop-shadow-md -mb-2" />
                    <div className="bg-white px-3 py-1.5 rounded-full shadow-lg text-[11px] font-bold text-slate-800">{design.storeName}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1 overflow-y-auto">
                <p className="font-extrabold text-[13px] text-slate-800">{design.address}</p>
                <div className="mt-4 flex gap-2">
                  <a href={`tel:${design.phone}`} className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] font-bold text-center active:scale-[0.98] transition-transform text-slate-700">전화하기</a>
                  <button onClick={() => window.open('https://map.naver.com/', '_blank')} className="flex-1 py-2.5 rounded-lg text-white text-[12px] font-bold text-center active:scale-[0.98] transition-transform" style={{ backgroundColor: design.themeColor }}>네이버지도 길찾기</button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Write Post Modal */}
      {
        isWritePostModalOpen && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in pb-safe">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsWritePostModalOpen(false)}></div>
            <div className="w-full h-[90vh] sm:h-[80vh] sm:max-h-[600px] sm:w-[90%] sm:rounded-2xl rounded-t-2xl bg-white relative shadow-2xl z-10 overflow-hidden flex flex-col animate-[slide-in-up_0.3s_ease-out]">
              <div className="h-12 border-b border-slate-100 flex justify-between items-center px-4 shrink-0 bg-white">
                <button onClick={() => setIsWritePostModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"><X size={20} /></button>
                <h3 className="font-extrabold text-slate-800 text-[15px]">글 작성하기</h3>
                <button
                  onClick={() => {
                    if (!newPostTitle.trim()) return showToast('제목을 입력해주세요.');
                    // - [x] '네일 블리스' 프리미엄 리브랜딩 (Premium Rebranding)
                    // - [x] 골드 & 에메랄드 테마 헤더 구현 (Glamorous Header)
                    // - [x] 프리미엄 골드 로고 제작 및 반영 (Metallic Gold Logo)
                    // - [x] 고화질 마케팅용 이미지 10종 생성 및 적용 (Marketing Portfolio Assets)
                    // - [x] 전문가용 마케팅 문구 및 스토리 데이터 고도화 (Corporate Grade Content)
                    // - [x] 헤더 검색/알림 기능 버그 수정 및 안정화
                    addStory({
                      title: newPostTitle,
                      content: newPostContent,
                      author: '작성자',
                      images: attachedPhotos,
                      img: attachedPhotos.length > 0 ? attachedPhotos[0] : undefined
                    });
                    setNewPostTitle(''); setNewPostContent('');
                    setAttachedPhotos([]);
                    setIsWritePostModalOpen(false);
                    showToast('글이 성공적으로 등록되었습니다.');
                  }}
                  className="text-[13px] font-bold tracking-tight active:scale-95 transition-transform" style={{ color: design.themeColor }}
                >
                  등록
                </button>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col px-4 py-3 bg-white">
                <input
                  autoFocus
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  className="w-full text-[16px] font-extrabold py-3 border-b border-slate-100 focus:outline-none placeholder-slate-300 transition-colors focus:border-slate-300"
                  placeholder="제목을 입력하세요."
                />
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  className="flex-1 w-full text-[13px] font-medium py-3 focus:outline-none placeholder-slate-300 resize-none pb-4"
                  placeholder="내용을 작성해보세요. (사진은 하단 버튼으로 첨부)"
                ></textarea>

                {/* Photo Previews */}
                {attachedPhotos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2 shrink-0 no-scrollbar">
                    {attachedPhotos.map((photo, i) => (
                      <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                        <img src={photo} className="w-full h-full object-cover" alt="Selected" />
                        <button
                          onClick={() => setAttachedPhotos(attachedPhotos.filter((_, idx) => idx !== i))}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="py-3 border-t border-slate-100 flex items-center gap-3 w-full shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (attachedPhotos.length + files.length > 10) {
                        showToast('최대 10장까지만 첨부할 수 있습니다.');
                        return;
                      }

                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAttachedPhotos(prev => [...prev, reader.result as string]);
                        };
                        reader.readAsDataURL(file);
                      });
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 bg-slate-50 active:scale-95 transition-transform"
                  >
                    <Camera size={18} />
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold ml-1">최대 10장 첨부 가능</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* 🖼️ Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 animate-fade-in p-4" onClick={() => setZoomedImage(null)}>
          <div className="relative w-full max-w-sm flex flex-col items-center">
            <button
              onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={zoomedImage}
              className="w-full h-auto rounded-xl shadow-2xl animate-scale-up border border-white/10"
              alt="Zoomed"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-white/70 text-xs font-bold flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
              <Eye size={14} /> 화면을 터치하면 닫힙니다
            </div>
          </div>
        </div>
      )}
      {/* 🚀 Management Views Overlay */}
      {managementView !== 'HOME' && (
        <div className="absolute inset-0 z-[100] bg-slate-50 flex flex-col animate-slide-in-right">
          <div className="h-14 px-4 flex items-center justify-between bg-emerald-500 text-white shadow-lg">
            <button onClick={() => setManagementView('HOME')} className="font-black flex items-center gap-2 active:scale-95 transition-transform cursor-pointer">
              <ChevronRight className="rotate-180" size={24} />
              {managementView === 'CUSTOMERS' ? '고객관리' : managementView === 'RESERVATIONS' ? '예약관리' : '직원관리'}
            </button>
            <button onClick={() => setIsManagementAddModalOpen(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg active:scale-95 transition-transform"><PlusCircle size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {managementView === 'CUSTOMERS' && (
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">전체 고객수</p>
                    <p className="text-lg font-black text-slate-800">1,284명</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-500">신규 +12명</p>
                    <p className="text-[10px] text-slate-400">이번 달 기준</p>
                  </div>
                </div>
                {[
                  { name: '김태희', phone: '010-1234-5678', last: '오늘 13:00', status: 'VIP' },
                  { name: '이영희', phone: '010-9876-5432', last: '어제 14:30', status: '일반' },
                  { name: '박지성', phone: '010-5555-4444', last: '3일 전', status: '신규' },
                  { name: '홍길동', phone: '010-1111-2222', last: '5일 전', status: 'VIP' },
                ].map((c, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">{c.name[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-black text-slate-800">{c.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${c.status === 'VIP' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>{c.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold">{c.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {managementView === 'RESERVATIONS' && (
              <div className="space-y-4">
                {[
                  { time: '13:00', name: '김태희', service: '풀염색 + 컷트', staff: '민지', status: '시술중' },
                  { time: '14:30', name: '이영희', service: '볼륨 셋팅펌', staff: '제니', status: '대기중' },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 pt-2 text-[11px] font-black text-slate-400 text-center">{r.time}</div>
                    <div className="flex-1 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
                      {r.status === '시술중' && <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 animate-pulse"></div>}
                      <span className="font-extrabold text-slate-800">{r.name} 고객님</span>
                      <p className="text-[11px] text-slate-500 font-bold">{r.service} | <span className="text-emerald-600 font-black">{r.staff}</span> 담당</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {managementView === 'STAFF' && (
              <div className="grid grid-cols-2 gap-3 pb-8">
                {[
                  { name: '민지', role: '수석디자이너', status: '근무중', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80', active: true },
                  { name: '제니', role: '디자이너', status: '근무중', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', active: true },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md text-center relative group active:scale-95 transition-transform cursor-pointer">
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white shadow-sm ${s.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 shadow-sm ${s.active ? 'border-emerald-100' : 'border-slate-100'}`}>
                      <img src={s.image} className="w-full h-full object-cover" alt="staff" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm mb-0.5">{s.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mb-4">{s.role}</p>
                    <div className="flex gap-1.5 px-1 text-[9px] font-black">
                      <button className="flex-1 py-1.5 bg-slate-50 text-slate-600 rounded-xl">데이터</button>
                      <button className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl">관리</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* 🚀 Management Add Modal (Fix for unresponsive + button) */}
      {isManagementAddModalOpen && (
        <div className="absolute inset-0 z-[200] flex items-end sm:items-center justify-center animate-fade-in pb-safe">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsManagementAddModalOpen(false)}></div>
          <div className="w-full h-[60vh] sm:h-[50vh] sm:max-h-[450px] sm:w-[90%] sm:rounded-3xl rounded-t-3xl bg-white relative shadow-2xl z-10 overflow-hidden flex flex-col animate-[slide-in-up_0.3s_ease-out]">
            <div className="h-14 border-b border-slate-100 flex justify-between items-center px-5 shrink-0 bg-white">
              <button onClick={() => setIsManagementAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"><X size={20} /></button>
              <h3 className="font-extrabold text-slate-800 text-[15px]">
                {managementView === 'CUSTOMERS' ? '새 고객 등록' : managementView === 'RESERVATIONS' ? '새 예약 등록' : '새 직원 등록'}
              </h3>
              <button
                onClick={() => {
                  showToast('성공적으로 등록되었습니다!');
                  setIsManagementAddModalOpen(false);
                }}
                className="text-[13px] font-bold tracking-tight text-emerald-500 active:scale-95 transition-transform"
              >
                등록하기
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {managementView === 'CUSTOMERS' && (
                <>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">고객 이름</label>
                    <input
                      type="text"
                      value={managementFormData.customerName}
                      onChange={(e) => setManagementFormData({ ...managementFormData, customerName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                      placeholder="성함을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">휴대폰 번호</label>
                    <input
                      type="tel"
                      value={managementFormData.customerPhone}
                      onChange={(e) => setManagementFormData({ ...managementFormData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">고객 등급</label>
                    <div className="flex gap-2">
                      {['일반', 'VIP', 'VVIP'].map(grade => (
                        <button
                          key={grade}
                          onClick={() => setManagementFormData({ ...managementFormData, customerGrade: grade })}
                          className={`flex-1 py-2.5 border rounded-xl text-xs font-bold transition-all ${managementFormData.customerGrade === grade ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-[1.02]' : 'bg-slate-50 text-slate-600 border-slate-100'}`}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {managementView === 'RESERVATIONS' && (
                <>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">예약 일시</label>
                    <input
                      type="datetime-local"
                      value={managementFormData.reservationDate}
                      onChange={(e) => setManagementFormData({ ...managementFormData, reservationDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">담당 직원</label>
                    <select
                      value={managementFormData.reservationStaff}
                      onChange={(e) => setManagementFormData({ ...managementFormData, reservationStaff: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                    >
                      <option value="">담당자 선택</option>
                      <option value="minji">민지 수석디자이너</option>
                      <option value="jennie">제니 디자이너</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">시술 항목</label>
                    <input
                      type="text"
                      value={managementFormData.reservationService}
                      onChange={(e) => setManagementFormData({ ...managementFormData, reservationService: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                      placeholder="시술 내용을 입력하세요"
                    />
                  </div>
                </>
              )}
              {managementView === 'STAFF' && (
                <>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">직원 성함</label>
                    <input
                      type="text"
                      value={managementFormData.staffName}
                      onChange={(e) => setManagementFormData({ ...managementFormData, staffName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                      placeholder="이름 입력"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1 uppercase">직책</label>
                    <input
                      type="text"
                      value={managementFormData.staffRole}
                      onChange={(e) => setManagementFormData({ ...managementFormData, staffRole: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-300 transition-colors"
                      placeholder="ex) 디자이너, 매니저"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <UserCheck className="text-emerald-500" size={20} />
                    <p className="text-[10px] font-bold text-emerald-700 leading-tight">새 직원을 등록하면 자동으로<br />근태 관리 시스템에 추가됩니다.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 👤 Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center animate-fade-in pb-safe">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsProfileModalOpen(false)}></div>
          <div className="w-full h-[70vh] sm:h-auto sm:max-w-sm sm:rounded-3xl rounded-t-3xl bg-white relative shadow-2xl z-10 overflow-hidden flex flex-col animate-[slide-in-up_0.3s_ease-out]">
            <div className="h-14 border-b border-slate-100 flex justify-between items-center px-5 shrink-0 bg-white">
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"><X size={20} /></button>
              <h3 className="font-extrabold text-slate-800 text-[15px]">프로필 수정</h3>
              <button
                onClick={() => {
                  showToast('프로필이 성공적으로 변경되었습니다.');
                  setIsProfileModalOpen(false);
                }}
                className="text-[13px] font-bold tracking-tight text-blue-500 active:scale-95 transition-transform"
              >
                저장
              </button>
            </div>

            <div className="p-6 space-y-7 overflow-y-auto">
              <div className="flex flex-col items-center">
                <div
                  className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 relative border-4 border-slate-50 shadow-xl mb-3 overflow-hidden group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {userProfile.profileImage ? (
                    <img src={userProfile.profileImage} className="w-full h-full object-cover" alt="profile" />
                  ) : (
                    <User size={48} />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <Camera size={20} className="text-white mb-1" />
                    <span className="text-[8px] font-bold text-white uppercase">Upload</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase">Profile Identity</p>
              </div>

              {/* 가상 캐릭터 선택 섹션 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                    <Users size={12} className="text-emerald-500" /> Virtual Characters
                  </label>
                  <button
                    onClick={() => setUserProfile(prev => ({ ...prev, profileImage: null }))}
                    className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth">
                  {PREMIUM_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => selectAvatar(avatar.id)}
                      className="shrink-0 flex flex-col items-center gap-2 group transition-all"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 transition-all duration-300 border-2 ${userProfile.profileImage?.includes(avatar.id) ? 'border-emerald-500 bg-emerald-50 scale-110 shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'}`}>
                        <img
                          src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${avatar.id}&backgroundColor=f1f5f9`}
                          alt={avatar.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className={`text-[9px] font-bold whitespace-nowrap transition-colors ${userProfile.profileImage?.includes(avatar.id) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {avatar.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1">이름</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1">이메일</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 mb-2 block ml-1">휴대폰 번호</label>
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-2xl text-[13px] font-extrabold active:scale-[0.98] transition-transform"
                >
                  취소하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 🔔 Notification Modal */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center animate-fade-in pb-safe">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsNotificationOpen(false)}></div>
          <div className="w-full h-[60vh] sm:h-auto sm:max-w-sm sm:rounded-3xl rounded-t-3xl bg-white relative shadow-2xl z-10 overflow-hidden flex flex-col animate-[slide-in-up_0.3s_ease-out]">
            <div className="h-14 border-b border-slate-100 flex justify-between items-center px-5 shrink-0 bg-white">
              <button onClick={() => setIsNotificationOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-95 transition-transform"><X size={20} /></button>
              <h3 className="font-extrabold text-slate-800 text-[15px]">알림 센터</h3>
              <div className="w-8"></div>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              {[
                { id: 1, title: '💅 이달의 추천 아트 업데이트!', content: '봄 시즌에 어울리는 새로운 디자인 2종이 추가되었습니다.', time: '방금 전' },
                { id: 2, title: '🎫 4월 한정 20% 할인 쿠폰', content: '첫 방문 고객님을 위한 특별 할인 혜택을 놓치지 마세요.', time: '2시간 전' },
                { id: 3, title: '🗓️ 예약 확정 안내', content: '내일 오후 2시 예약이 확정되었습니다.', time: '어제' }
              ].map(noti => (
                <div key={noti.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[13px] font-bold text-slate-800">{noti.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{noti.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{noti.content}</p>
                </div>
              ))}

              <div className="py-4 text-center">
                <p className="text-[10px] font-bold text-slate-300">최근 30일간의 알림만 표시됩니다.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-50 bg-slate-50/50">
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="w-full py-3.5 bg-white text-slate-500 border border-slate-100 rounded-2xl text-[13px] font-extrabold active:scale-[0.98] transition-transform shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
