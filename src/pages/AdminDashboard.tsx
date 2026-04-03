import { useState, useRef } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import {
    Store, PieChart, Store as StoreIcon, Palette,
    ClipboardList, MailOpen, Smartphone, User,
    Heart, Zap, ChevronRight, Bell, Menu, Image,
    Plus, Trash2, X, Users, Calendar, UserCheck, Search, Upload
} from 'lucide-react';
import { useAppStore } from '../store';

export default function AdminDashboard() {
    const location = useLocation();
    const { design, updateDesign, inquiries } = useAppStore();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [activeBoardTab, setActiveBoardTab] = useState(0);
    const [activeInquiryTab, setActiveInquiryTab] = useState(0);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [adminRole, setAdminRole] = useState<'HQ' | 'STORE'>('HQ');
    const [adminLevel, setAdminLevel] = useState<'DIRECTOR' | 'MANAGER' | 'ASSISTANT' | 'STAFF'>('DIRECTOR');
    const [salesTab, setSalesTab] = useState<'MONTH' | 'YEAR'>('MONTH');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadTarget, setUploadTarget] = useState<string | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const triggerUpload = (target: string) => {
        setUploadTarget(target);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
            showToast('파일 크기는 500KB 이내여야 합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            if (uploadTarget === 'shortcutIcon') updateDesign({ shortcutIcon: base64String });
            else if (uploadTarget === 'logoImage') updateDesign({ logoImage: base64String });
            else if (uploadTarget === 'bannerImage') updateDesign({ bannerImages: [base64String] });
            else if (uploadTarget === 'topBgImage') updateDesign({ topBgImage: base64String });
            else if (uploadTarget?.startsWith('attraction-')) {
                const idx = parseInt(uploadTarget.split('-')[1]);
                const newAttractions = [...(design.attractions || [])];
                if (newAttractions[idx]) {
                    newAttractions[idx] = { ...newAttractions[idx], image: base64String };
                    updateDesign({ attractions: newAttractions });
                }
            }

            showToast('사진이 업로드되었습니다.');
        };
        reader.readAsDataURL(file);
        // Reset input to allow same file upload
        e.target.value = '';
    };

    const getLevelName = () => {
        if (adminLevel === 'DIRECTOR') return '이사';
        if (adminLevel === 'MANAGER') return '팀장';
        if (adminLevel === 'ASSISTANT') return '대리';
        return '사원';
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Helper to determine active state
    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col shadow-xl z-10 transition-all">
                <div className="p-6 text-xl font-bold text-white border-b border-slate-700/50 flex items-center gap-2">
                    <Store className="text-primary h-6 w-6" />
                    <span className="tracking-tight">{design.storeName} 관리자</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 text-sm font-medium overflow-y-auto">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <PieChart size={20} className={isActive('/admin') ? 'text-white' : 'text-slate-400'} /> 대시보드 (통계)
                    </Link>

                    {adminRole === 'STORE' && adminLevel !== 'STAFF' && (
                        <>
                            <div className="pt-5 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">내 매장 환경설정</div>
                            <Link
                                to="/admin/store"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/store') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <StoreIcon size={20} className={isActive('/admin/store') ? 'text-white' : 'text-slate-400'} /> 매장 기본 설정
                            </Link>
                            {(adminLevel === 'MANAGER' || adminLevel === 'DIRECTOR') && (
                                <Link
                                    to="/admin/design"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/design') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                                >
                                    <Palette size={20} className={isActive('/admin/design') ? 'text-white' : 'text-slate-400'} /> 가맹점 앱 디자인 관리
                                </Link>
                            )}

                            <div className="pt-5 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">매장 통합 운영</div>
                            <Link
                                to="/admin/customers"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/customers') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Users size={20} className={isActive('/admin/customers') ? 'text-white' : 'text-slate-400'} /> 고객관리
                            </Link>
                            <Link
                                to="/admin/reservations"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/reservations') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Calendar size={20} className={isActive('/admin/reservations') ? 'text-white' : 'text-slate-400'} /> 예약관리
                            </Link>
                            <Link
                                to="/admin/staff"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/staff') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <UserCheck size={20} className={isActive('/admin/staff') ? 'text-white' : 'text-slate-400'} /> 직원관리
                            </Link>
                        </>
                    )}

                    {adminRole === 'HQ' && adminLevel !== 'STAFF' && (
                        <>
                            <div className="pt-5 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">본사 관리 메뉴</div>
                            <Link
                                to="/admin/hq/franchisees"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/hq/franchisees') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <StoreIcon size={20} className={isActive('/admin/hq/franchisees') ? 'text-white' : 'text-slate-400'} /> 전체 가맹점 관리
                            </Link>
                            {(adminLevel === 'MANAGER' || adminLevel === 'DIRECTOR') && (
                                <Link
                                    to="/admin/hq/templates"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/hq/templates') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                                >
                                    <Palette size={20} className={isActive('/admin/hq/templates') ? 'text-white' : 'text-slate-400'} /> 본사 앱 디자인/템플릿 배포
                                </Link>
                            )}
                            {(adminLevel === 'MANAGER' || adminLevel === 'DIRECTOR') && (
                                <Link
                                    to="/admin/hq/images"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/hq/images') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                                >
                                    <Image size={20} className={isActive('/admin/hq/images') ? 'text-white' : 'text-slate-400'} /> 본사 이미지/로고 관리
                                </Link>
                            )}
                            <Link
                                to="/admin/hq/sales"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/hq/sales') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <PieChart size={20} className={isActive('/admin/hq/sales') ? 'text-white' : 'text-slate-400'} /> 전사 매출 통계
                            </Link>
                        </>
                    )}

                    <div className="pt-5 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">콘텐츠 운영</div>
                    <Link
                        to="/admin/boards"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/boards') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ClipboardList size={20} className={isActive('/admin/boards') ? 'text-white' : 'text-slate-400'} /> 게시판/리뷰 관리
                    </Link>
                    <Link
                        to="/admin/inquiries"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/inquiries') ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <MailOpen size={20} className={isActive('/admin/inquiries') ? 'text-white' : 'text-slate-400'} /> 문의 카톡 및 신청
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700/50">
                    <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-primary to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            <span className="text-sm">SN</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate text-ellipsis">{adminRole === 'HQ' ? `본사 (${getLevelName()})` : `강남점 (${getLevelName()})`}</p>
                            <p className="text-[11px] text-slate-400 truncate">{adminRole === 'HQ' ? `hq_${adminLevel.toLowerCase()}@${(design.domainUrl || '이지택스.kr').replace('http://', '').replace('https://', '')}` : `gangnam_${adminLevel.toLowerCase()}@${(design.domainUrl || '이지택스.kr').replace('http://', '').replace('https://', '')}`}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm flex items-center justify-between px-8 z-10 shrink-0 sticky top-0">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">관리자 센터</h2>
                    <div className="flex items-center gap-6">
                        <div className="flex p-0.5 bg-slate-100 rounded-lg">
                            <button onClick={() => setAdminRole('HQ')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${adminRole === 'HQ' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>🏢 본사</button>
                            <button onClick={() => setAdminRole('STORE')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${adminRole === 'STORE' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>🏪 가맹점</button>
                        </div>
                        <div className="flex p-0.5 bg-slate-100 rounded-lg ml-2">
                            <button onClick={() => setAdminLevel('DIRECTOR')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${adminLevel === 'DIRECTOR' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>이사</button>
                            <button onClick={() => setAdminLevel('MANAGER')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${adminLevel === 'MANAGER' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>팀장</button>
                            <button onClick={() => setAdminLevel('ASSISTANT')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${adminLevel === 'ASSISTANT' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>대리</button>
                            <button onClick={() => setAdminLevel('STAFF')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${adminLevel === 'STAFF' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}>사원</button>
                        </div>
                        <button onClick={() => setIsPreviewModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold transition-colors active:scale-95 cursor-pointer border border-slate-200 shadow-sm">
                            <Smartphone size={16} className="text-primary" /> 라이브 미리보기
                        </button>
                        <button className="relative w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                            <User size={18} className="text-slate-500" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                        <Routes>
                            <Route path="" element={
                                <div>
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">대시보드</h1>
                                            <p className="text-sm text-slate-500 mt-1">오늘의 주요 발생 지표와 스토어 운영 상태를 요약합니다.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-primary hover:bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95">
                                            리포트 다운로드
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-6">
                                        {adminRole === 'STORE' ? (
                                            <>
                                                {/* Summary Cards */}
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        주간 방문자 <StoreIcon size={16} className="text-primary opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">1,204<span className="text-sm font-medium text-slate-400 ml-1">명</span></div>
                                                    <div className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">+12% <span className="text-slate-400 font-medium">전주 대비</span></div>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        신규 단골 구독 <Heart size={16} className="text-rose-500 opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">48<span className="text-sm font-medium text-slate-400 ml-1">명</span></div>
                                                    <div className="text-xs font-bold text-rose-500 mt-3 flex items-center gap-1">-2% <span className="text-slate-400 font-medium">전주 대비</span></div>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        우리매장 이벤트 클릭 <Zap size={16} className="text-amber-500 opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">8,392<span className="text-sm font-medium text-slate-400 ml-1">회</span></div>
                                                    <div className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">+34% <span className="text-slate-400 font-medium">전주 대비</span></div>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        신규 고객 문의 <MailOpen size={16} className="text-blue-500 opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">5<span className="text-sm font-medium text-slate-400 ml-1">건</span></div>
                                                    <div className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1">신규 답변 필요</div>
                                                </div>

                                                {/* 🚀 Integrated Management Quick Links (Hidden for non-directors) */}
                                                {adminLevel === 'DIRECTOR' && (
                                                    <div className="col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-4">
                                                        <div className="flex items-center justify-between mb-8">
                                                            <h3 className="font-extrabold text-slate-800 tracking-tight text-lg">매장 통합 운영 서비스</h3>
                                                            <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">SN Premium Plus</span>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-10">
                                                            <Link to="/admin/customers" className="flex flex-col items-center text-center group cursor-pointer">
                                                                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-blue-100 group-hover:scale-105 group-hover:bg-blue-100 transition-all duration-300">
                                                                    <Users size={36} className="text-blue-500 group-hover:text-blue-600" />
                                                                </div>
                                                                <h4 className="text-[17px] font-black text-slate-800 mb-2 leading-tight">고객관리</h4>
                                                                <p className="text-[12px] text-slate-400 font-bold leading-relaxed px-2">체계적이고 세심한<br />고객관리 서비스!</p>
                                                            </Link>
                                                            <Link to="/admin/reservations" className="flex flex-col items-center text-center group cursor-pointer">
                                                                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-blue-100 group-hover:scale-105 group-hover:bg-blue-100 transition-all duration-300">
                                                                    <Calendar size={36} className="text-blue-500 group-hover:text-blue-600" />
                                                                </div>
                                                                <h4 className="text-[17px] font-black text-slate-800 mb-2 leading-tight">예약관리</h4>
                                                                <p className="text-[12px] text-slate-400 font-bold leading-relaxed px-2">샵 맞춤형으로<br />예약을 관리하세요!</p>
                                                            </Link>
                                                            <Link to="/admin/staff" className="flex flex-col items-center text-center group cursor-pointer">
                                                                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-blue-100 group-hover:scale-105 group-hover:bg-blue-100 transition-all duration-300">
                                                                    <UserCheck size={36} className="text-blue-500 group-hover:text-blue-600" />
                                                                </div>
                                                                <h4 className="text-[17px] font-black text-slate-800 mb-2 leading-tight">직원관리</h4>
                                                                <p className="text-[12px] text-slate-400 font-bold leading-relaxed px-2">근태, 급여부터<br />인센티브 자동관리!</p>
                                                            </Link>
                                                            <Link to="/admin/design" className="flex flex-col items-center text-center group cursor-pointer">
                                                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-emerald-100 group-hover:scale-105 group-hover:bg-emerald-100 transition-all duration-300">
                                                                    <Palette size={36} className="text-emerald-500 group-hover:text-emerald-600" />
                                                                </div>
                                                                <h4 className="text-[17px] font-black text-slate-800 mb-2 leading-tight">가맹점 디자인</h4>
                                                                <p className="text-[12px] text-slate-400 font-bold leading-relaxed px-2">우리 매장만의 개성있는<br />앱 디자인 커스텀!</p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        전체 활성 가맹점 <StoreIcon size={16} className="text-slate-800 opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">342<span className="text-sm font-medium text-slate-400 ml-1">개</span></div>
                                                    <div className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">+8개 <span className="text-slate-400 font-medium">이번 달 신규</span></div>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        전사 누적 거래액 <Heart size={16} className="text-rose-500 opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">2.1<span className="text-sm font-medium text-slate-400 ml-1">억</span></div>
                                                    <div className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">+15% <span className="text-slate-400 font-medium">전월 대비</span></div>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        본사 브랜드 조회수 <Zap size={16} className="text-amber-500 opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-800">124k<span className="text-sm font-medium text-slate-400 ml-1">회</span></div>
                                                    <div className="text-xs font-bold text-emerald-500 mt-3 flex items-center gap-1">+8% <span className="text-slate-400 font-medium">전주 대비</span></div>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                                                    <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center justify-between">
                                                        가맹 신청 승인 대기 <MailOpen size={16} className="text-primary opacity-70" />
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-rose-500">14<span className="text-sm font-medium text-slate-400 ml-1">건</span></div>
                                                    <div className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1 line-clamp-1 underline cursor-pointer">승인 처리하러 가기</div>
                                                </div>

                                                {/* HQ Design/Image Quick Link Section */}
                                                <div className="col-span-4 grid grid-cols-2 gap-6 mt-4">
                                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-extrabold text-slate-800 tracking-tight text-lg mb-1">본사 앱 디자인 및 템플릿 배포</h3>
                                                            <p className="text-xs text-slate-500 font-bold">전체 가맹점에 적용될 브랜드 테마를 관리합니다.</p>
                                                        </div>
                                                        <Link to="/admin/hq/templates" className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95">
                                                            <Palette size={18} /> 디자인 배포
                                                        </Link>
                                                    </div>
                                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-extrabold text-slate-800 tracking-tight text-lg mb-1">본사 이미지/로고 브랜드 관리</h3>
                                                            <p className="text-xs text-slate-500 font-bold">공식 로고 및 브랜드 에셋 이미지를 관리합니다.</p>
                                                        </div>
                                                        <Link to="/admin/hq/images" className="px-6 py-3 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95">
                                                            <Image size={18} /> 이미지 관리
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-8 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 relative">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2"><PieChart size={18} className="text-slate-400" /> 주간 방문자 및 예약 추이</h3>
                                            <div className="flex gap-4 text-xs font-bold">
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary"></div>방문자 수</div>
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-300"></div>신규 예약/문의</div>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between h-52 px-2 sm:px-10 gap-2">
                                            {/* mock bars */}
                                            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                                                <div key={day} className="flex flex-col items-center flex-1 gap-3 relative group">
                                                    <div className="w-full h-full flex items-end justify-center gap-1 md:gap-2 relative z-10">
                                                        <div className="w-full md:w-8 bg-primary/80 rounded-t border-t border-primary/50 transition-all group-hover:bg-primary shadow-sm" style={{ height: `${Math.random() * 60 + 30}%` }}></div>
                                                        <div className="w-full md:w-8 bg-indigo-200 rounded-t border-t border-indigo-300 transition-all group-hover:bg-indigo-300" style={{ height: `${Math.random() * 40 + 10}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">{day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            } />
                            <Route path="store" element={
                                <div className="animate-fade-in flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10">
                                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2"><StoreIcon size={24} className="text-primary" /> 매장 기본정보 및 도메인 설정</h1>
                                    <p className="text-sm text-slate-500 mb-2">고객에게 노출될 기본 매장 정보와 앱 운영 도메인을 관리합니다.</p>

                                    {/* 기본정보 (Basic Info) */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-700 flex items-center gap-2"><StoreIcon size={18} className="text-primary" /> 기본정보</div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">상호/업체명</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.businessName || ''} onChange={e => updateDesign({ businessName: e.target.value })} /></div>
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">대표자명</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.ceoName || ''} onChange={e => updateDesign({ ceoName: e.target.value })} /></div>
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">문의전화</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.phone || ''} onChange={e => updateDesign({ phone: e.target.value })} /></div>
                                            <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-600 mb-1.5">주소/지도 등록</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.address || ''} onChange={e => updateDesign({ address: e.target.value })} /></div>
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">분류 1차</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.category1 || ''} onChange={e => updateDesign({ category1: e.target.value })} /></div>
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">분류 2차</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.category2 || ''} onChange={e => updateDesign({ category2: e.target.value })} /></div>
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">영업시간</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.openHours || ''} onChange={e => updateDesign({ openHours: e.target.value })} /></div>
                                            <div><label className="block text-sm font-bold text-slate-600 mb-1.5">문의 이메일</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.email || ''} onChange={e => updateDesign({ email: e.target.value })} /></div>
                                            <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-600 mb-1.5">사업자 등록번호</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" value={design.bizNumber || ''} onChange={e => updateDesign({ bizNumber: e.target.value })} /></div>
                                            <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-600 mb-1.5">업체 소개글</label><textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium h-20 resize-none" value={design.introText || ''} onChange={e => updateDesign({ introText: e.target.value })} /></div>
                                            <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-600 mb-1.5">이용안내</label><textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium h-16 resize-none" value={design.guideText || ''} onChange={e => updateDesign({ guideText: e.target.value })} /></div>
                                        </div>
                                    </div>

                                    {/* 도메인 설정 (Domain Settings) -> 4.1 주소관리 및 설정 */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 flex flex-col">
                                        <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-700 flex items-center gap-2"><Smartphone size={18} className="text-primary" /> 주소관리 및 설정</div>
                                        <div className="p-6 space-y-6">
                                            {/* 도메인 */}
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b border-slate-100 pb-5">
                                                <label className="text-sm font-bold text-slate-600 md:col-span-1 border-r border-slate-200 pr-4">도메인 관리</label>
                                                <div className="md:col-span-5 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-24 text-xs font-bold text-slate-500">자동 도메인</span>
                                                        <input className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-48 focus:border-primary outline-none" placeholder="1234" />
                                                        <button className="px-3 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-200">중복확인</button>
                                                        <span className="text-xs text-slate-400 font-medium ml-2">* 4~6자, 영문이나 숫자사용. http://id.{(design.domainUrl || '이지택스.kr').replace('http://', '').replace('https://', '')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-24 text-xs font-bold text-slate-500">웹사이트 URL</span>
                                                        <div className="flex bg-slate-50 rounded-lg border border-slate-200 overflow-hidden w-full max-w-sm"><input className="flex-1 bg-transparent px-3 py-1.5 text-sm focus:outline-none font-medium text-slate-700" placeholder="https://" value={design.domainUrl || ''} onChange={e => updateDesign({ domainUrl: e.target.value })} /></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 라디오 옵션들 */}
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                                <label className="text-sm font-bold text-slate-600 md:col-span-1 border-r border-slate-200 pr-4">모바일웹 사용</label>
                                                <div className="md:col-span-5 flex gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700"><input type="radio" checked={design.useMobileWeb !== false} onChange={() => updateDesign({ useMobileWeb: true })} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" /> 사용</label>
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700"><input type="radio" checked={design.useMobileWeb === false} onChange={() => updateDesign({ useMobileWeb: false })} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" /> 미사용</label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                                <label className="text-sm font-bold text-slate-600 md:col-span-1 border-r border-slate-200 pr-4">PC사이트 URL</label>
                                                <div className="md:col-span-5"><input className="w-full max-w-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:border-primary outline-none transition-all text-sm font-medium" value={design.pcUrl || ''} onChange={e => updateDesign({ pcUrl: e.target.value })} /></div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                                <label className="text-sm font-bold text-slate-600 md:col-span-1 border-r border-slate-200 pr-4">모바일앱 인사말</label>
                                                <div className="md:col-span-5">
                                                    <input className="w-full max-w-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:border-primary outline-none transition-all text-sm font-medium" value={design.greetingText || ''} onChange={e => updateDesign({ greetingText: e.target.value })} placeholder="환영합니다" />
                                                    <p className="text-xs text-slate-400 font-medium mt-1">* 모바일에서 즐겨찾기 이름으로 사용됩니다. 한글 30자 이내</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start border-b border-slate-100 pb-5">
                                                <label className="text-sm font-bold text-slate-600 md:col-span-1 border-r border-slate-200 pr-4 pt-2">배경 아이콘<br /><span className="text-xs font-normal text-slate-400">(바로가기)</span></label>
                                                <div className="md:col-span-5 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <input value={design.shortcutIcon || ''} onChange={e => updateDesign({ shortcutIcon: e.target.value })} placeholder="URL 직접 입력" className="flex-1 max-w-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm font-medium" />
                                                        <button onClick={() => triggerUpload('shortcutIcon')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-1"><Image size={14} /> 사진등록</button>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-medium">* PNG 파일 / 권장 사이즈 114x114 / 500kb 이하</p>
                                                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-[11px] text-slate-500 font-medium leading-relaxed mt-2 whitespace-pre-line">
                                                        ▶ <b>아이폰</b>: ① 바로가기 하고자하는 사이트에 접속합니다. ② 하단 중앙에 위치한 버튼을 눌러 '홈 화면에 추가'를 누르시면 됩니다.<br />
                                                        ▶ <b>안드로이드</b>: ① 바로가기 하고자하는 사이트를 북마크(즐겨찾기)에 추가합니다. ② 하단 중앙에 위치한 버튼을 눌러 '홈 화면에 추가'를 누르시면 됩니다.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                                <label className="text-sm font-bold text-slate-600 md:col-span-1 border-r border-slate-200 pr-4">SNS 사용</label>
                                                <div className="md:col-span-5 flex gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700"><input type="radio" checked={design.snsEnabled !== false} onChange={() => updateDesign({ snsEnabled: true })} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" /> 사용</label>
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700"><input type="radio" checked={design.snsEnabled === false} onChange={() => updateDesign({ snsEnabled: false })} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" /> 미사용</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4.2 app 알림 및 잠금번호 설정 */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6 flex flex-col">
                                        <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-700 flex items-center gap-2"><Bell size={18} className="text-rose-500" /> app 알림 및 잠금번호 설정</div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-800 flex items-center gap-2 tracking-tight text-sm"><span className="text-rose-500">▶</span> app 푸쉬알림 설정</h3>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">※ {design.storeName} app관리자와 연동됩니다.<br />※ 푸쉬 알림을 원하지 않으실 경우 'OFF'로 설정하세요.</p>
                                                </div>
                                                <button onClick={() => showToast('알림 설정이 저장되었습니다.')} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer">저장하기</button>
                                            </div>

                                            <div className="space-y-0 text-sm">
                                                {[
                                                    { label: '새로운 공지사항', key: 'newNotice' },
                                                    { label: '게시글 등록', key: 'newPost' },
                                                    { label: '게시글 답변', key: 'postReply' },
                                                    { label: '리뷰 등록', key: 'newReview' },
                                                    { label: '예약 문의 등록', key: 'newInquiry' },
                                                    { label: '신청서 등록', key: 'newApp' }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 pl-4 pr-16 hover:bg-slate-50 transition-colors">
                                                        <span className="font-bold text-slate-600">{item.label}</span>
                                                        <div className="flex gap-4">
                                                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-[13px] font-bold">
                                                                <input type="radio" checked={design.pushSettings ? (design.pushSettings as any)[item.key] === true : true} onChange={() => { const newP = { ...design.pushSettings }; (newP as any)[item.key] = true; updateDesign({ pushSettings: newP as any }); }} className="w-3.5 h-3.5 text-primary focus:ring-primary" /> ON
                                                            </label>
                                                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-[13px] font-bold lg:ml-6">
                                                                <input type="radio" checked={design.pushSettings ? (design.pushSettings as any)[item.key] === false : false} onChange={() => { const newP = { ...design.pushSettings }; (newP as any)[item.key] = false; updateDesign({ pushSettings: newP as any }); }} className="w-3.5 h-3.5 text-primary focus:ring-primary" /> OFF
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center mt-12 mb-4 border-b border-slate-200 pb-2">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-800 flex items-center gap-2 tracking-tight text-sm"><span className="text-rose-500">▶</span> app 잠금번호 초기화</h3>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">※ 잠금번호 초기화시, 저장했던 비밀번호가 삭제되고, 비밀번호 입력없이 로그인할 수 있습니다.</p>
                                                </div>
                                                <button onClick={() => { if (confirm('정말 잠금번호를 초기화하시겠습니까?')) showToast('초기화 되었습니다.'); }} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer">초기화 하기</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6"><button onClick={() => showToast('설정이 저장되었습니다.')} className="px-8 py-3 bg-primary hover:bg-indigo-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-md shadow-primary/20">변경사항 일괄 저장</button></div>
                                </div>
                            } />
                            <Route path="design" element={
                                <div className="animate-fade-in flex flex-col lg:flex-row gap-8 min-h-[75vh]">
                                    {/* Editor Panel */}
                                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                                        <div className="p-6 border-b border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                                                    <Palette className="text-primary" /> 모바일 홈페이지 테마 디자인
                                                </h1>
                                                <button onClick={() => setIsPreviewModalOpen(true)} className="flex lg:hidden items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all shadow-sm">
                                                    <Smartphone size={14} className="text-primary" /> 폰 화면 미리보기
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">이곳에서 설정한 테마 색상과 배너는 고객이 접속하는 모바일 웹 상단에 실시간으로 반영됩니다.</p>
                                        </div>
                                        <div className="p-6 overflow-y-auto space-y-8 flex-1">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-3">포인트 컬러 테마</label>
                                                <div className="flex gap-3">
                                                    {['#10b981', '#f97316', '#3b82f6', '#ec4899', '#8b5cf6', '#1e293b'].map(color => (
                                                        <button
                                                            key={color}
                                                            onClick={() => updateDesign({ themeColor: color })}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${design.themeColor === color ? 'scale-110 ring-4 ring-offset-2 ring-primary/30' : 'hover:scale-105 shadow-sm'}`}
                                                            style={{ backgroundColor: color }}
                                                        >
                                                            {design.themeColor === color && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                                <h3 className="font-extrabold text-slate-800 border-b border-slate-200 pb-2 mb-3">▶ 상단 디자인 (로고 및 배경)</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                    <label className="text-sm font-bold text-slate-600">로고 이미지</label>
                                                    <div className="md:col-span-3 flex gap-2">
                                                        <input value={design.logoImage || ''} onChange={e => updateDesign({ logoImage: e.target.value })} placeholder="미입력시 텍스트 로고 노출 자동 등록" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-sm bg-white" />
                                                        <button onClick={() => triggerUpload('logoImage')} className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-200 transition-colors text-xs font-bold flex gap-1 items-center shrink-0"><Image size={14} /> 사진등록</button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                    <label className="text-sm font-bold text-slate-600">로고 텍스트</label>
                                                    <div className="md:col-span-3"><input value={design.storeName} onChange={e => updateDesign({ storeName: e.target.value })} placeholder="상호명 입력" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-sm bg-white" /></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                    <label className="text-sm font-bold text-slate-600 pt-2">상단 배경/글자색</label>
                                                    <div className="md:col-span-3 space-y-2">
                                                        <div className="flex gap-2 items-center">
                                                            <span className="text-xs font-bold w-16 text-slate-500">배경 이미지</span>
                                                            <input value={design.topBgImage || ''} onChange={e => updateDesign({ topBgImage: e.target.value })} placeholder="URL 직접 지정" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-[13px] bg-white" />
                                                            <button onClick={() => triggerUpload('topBgImage')} className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-200 transition-colors text-xs font-bold flex gap-1 items-center shrink-0"><Image size={14} /> 사진등록</button>
                                                        </div>
                                                        <div className="flex gap-6 items-center bg-white p-2 border border-slate-200 rounded-lg">
                                                            <div className="flex gap-2 items-center">
                                                                <span className="text-[13px] font-bold text-slate-600">배경 색상</span>
                                                                <div className="flex border border-slate-200 rounded overflow-hidden">
                                                                    <input type="text" value={design.topBgColor || '#10b981'} readOnly className="w-16 px-1.5 text-xs text-center outline-none bg-slate-50" />
                                                                    <input type="color" value={design.topBgColor || '#10b981'} onChange={e => updateDesign({ topBgColor: e.target.value })} className="w-6 h-6 border-0 p-0 cursor-pointer" />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <span className="text-[13px] font-bold text-slate-600">글자 색상</span>
                                                                <div className="flex border border-slate-200 rounded overflow-hidden">
                                                                    <input type="text" value={design.topTextColor || '#ffffff'} readOnly className="w-16 px-1.5 text-xs text-center outline-none bg-slate-50" />
                                                                    <input type="color" value={design.topTextColor || '#ffffff'} onChange={e => updateDesign({ topTextColor: e.target.value })} className="w-6 h-6 border-0 p-0 cursor-pointer" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-3">메인 공지사항 (티커)</label>
                                                <input
                                                    value={design.noticeText}
                                                    onChange={e => updateDesign({ noticeText: e.target.value })}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-slate-50 focus:bg-white transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-3">메인 배너 이미지 사진 URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={design.bannerImages[0] || ''}
                                                        onChange={e => updateDesign({ bannerImages: [e.target.value] })}
                                                        placeholder="이미지 주소를 입력하세요"
                                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-slate-50 focus:bg-white transition-colors"
                                                    />
                                                    <button onClick={() => triggerUpload('bannerImage')} className="bg-slate-100 hover:bg-slate-200 px-4 rounded-xl text-slate-600 border border-slate-200 transition-colors"><Image size={18} /></button>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                                <h3 className="font-extrabold text-slate-800 border-b border-slate-200 pb-2 mb-3">▶ 메뉴 관리 설정</h3>

                                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
                                                    <div>
                                                        <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                                                            상단 탭 카테고리 명칭 변경
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {Array.isArray(design.headerMenus) && design.headerMenus.map((menu, i) => (
                                                                <div key={i} className="space-y-1.5">
                                                                    <label className="text-[10px] font-bold text-slate-400 ml-1">{i === 0 ? '탭 1 (홈)' : i === 1 ? '탭 2 (스토리)' : i === 2 ? '탭 3 (신청)' : '탭 4 (위치)'}</label>
                                                                    <input
                                                                        value={typeof menu === 'string' ? menu : (menu as any).title || ''}
                                                                        onChange={e => {
                                                                            const newMenus = [...design.headerMenus];
                                                                            newMenus[i] = e.target.value as any;
                                                                            updateDesign({ headerMenus: newMenus });
                                                                        }}
                                                                        className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 focus:bg-white focus:border-primary outline-none text-xs font-bold transition-all"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-slate-100">
                                                        <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <div className="w-1 h-3 bg-rose-500 rounded-full"></div>
                                                            메인 화면 섹션 제목 변경
                                                        </h4>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-400 ml-1">명가/명소 섹션 타이틀</label>
                                                            <input
                                                                value={design.attractionsTitle || ''}
                                                                onChange={e => updateDesign({ attractionsTitle: e.target.value })}
                                                                className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 focus:bg-white focus:border-primary outline-none text-xs font-bold transition-all"
                                                                placeholder="예: 우리동네 명소, 가볼만한 곳"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="mt-4">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">하단 메뉴 편집 관리</label>
                                                    <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                                                        {design.bottomMenus.map((menu, i) => (
                                                            <div key={i} className="flex gap-2 items-center">
                                                                <div className="text-slate-400 text-xs font-black">{i + 1}.</div>
                                                                <span className="text-xs font-bold text-slate-500 w-8 text-center bg-slate-100 rounded">명칭</span>
                                                                <input value={menu} onChange={e => { const newMenus = [...design.bottomMenus]; newMenus[i] = e.target.value; updateDesign({ bottomMenus: newMenus }); }} className="w-32 px-2 py-1 border border-slate-200 rounded outline-none focus:border-primary text-xs" />
                                                                <span className="text-xs font-bold text-slate-500 w-8 ml-2 text-center bg-slate-100 rounded">링크</span>
                                                                <select className="flex-1 px-2 py-1 border border-slate-200 rounded outline-none focus:border-primary text-xs bg-slate-50">
                                                                    <option>{menu} 고정</option>
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">메인 게시판 메뉴 순서</label>
                                                    <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                                            <div key={i} className="flex gap-2 items-center">
                                                                <div className="text-slate-400 text-xs font-black w-4">{i}.</div>
                                                                <select className="px-2 py-1 border border-slate-200 rounded outline-none focus:border-primary text-xs bg-slate-50 flex-1">
                                                                    <option>{i === 1 ? '게시판 (게시판 노출)' : i === 3 ? '스토리 (갤러리 노출)' : '사용안함'}</option>
                                                                    <option>게시판</option>
                                                                    <option>스토리</option>
                                                                    <option>사용안함</option>
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
                                                        <span>메인 화면 '명소' 목록 관리</span>
                                                        <button
                                                            onClick={() => {
                                                                const newAtts = [...(design.attractions || [])];
                                                                newAtts.push({ id: Date.now().toString(), title: '새 명소', image: 'https://images.unsplash.com/photo-1500000000000?w=400&q=80' });
                                                                updateDesign({ attractions: newAtts });
                                                            }}
                                                            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                                                        >
                                                            <Plus size={12} /> 항목 추가
                                                        </button>
                                                    </label>

                                                    <div className="grid grid-cols-1 gap-3">
                                                        {(design.attractions || []).map((att, idx) => (
                                                            <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group relative">
                                                                <button
                                                                    onClick={() => {
                                                                        const newAtts = (design.attractions || []).filter((_, i) => i !== idx);
                                                                        updateDesign({ attractions: newAtts });
                                                                    }}
                                                                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>

                                                                <div className="flex gap-4 items-center">
                                                                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100 relative group/img">
                                                                        <img src={att.image} className="w-full h-full object-cover" alt="attraction" />
                                                                        <button
                                                                            onClick={() => triggerUpload(`attraction-${idx}`)}
                                                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                                                                        >
                                                                            <Image size={16} className="text-white" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex-1 space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[11px] font-bold text-slate-400 w-12">제목</span>
                                                                            <input
                                                                                value={att.title}
                                                                                onChange={(e) => {
                                                                                    const newAtts = [...(design.attractions || [])];
                                                                                    newAtts[idx] = { ...newAtts[idx], title: e.target.value };
                                                                                    updateDesign({ attractions: newAtts });
                                                                                }}
                                                                                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-primary transition-colors"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[11px] font-bold text-slate-400 w-12">이미지</span>
                                                                            <input
                                                                                value={att.image}
                                                                                onChange={(e) => {
                                                                                    const newAtts = [...(design.attractions || [])];
                                                                                    newAtts[idx] = { ...newAtts[idx], image: e.target.value };
                                                                                    updateDesign({ attractions: newAtts });
                                                                                }}
                                                                                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-primary transition-colors text-slate-500"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-8 border-t border-slate-200 pt-5 flex gap-5 items-center">
                                                    <div className="w-24 h-24 border border-slate-200 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center">
                                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=example" className="max-w-full max-h-full" alt="QR" />
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-[15px] text-slate-800">업체 모바일앱 QR</p>
                                                        <p className="text-xs text-slate-500 mt-1 leading-snug">- 해당 상점의 모바일앱 QR코드입니다.<br />복사 버튼을 클릭하면 이미지 소스 태그가 복사됩니다.</p>
                                                        <button onClick={() => showToast('QR코드 이미지 태그 복사 완료')} className="mt-3 px-4 py-1.5 bg-slate-600 text-white text-[11px] font-bold rounded shadow-sm hover:bg-slate-700 transition-colors">✔ QR 코드 이미지 복사</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Phone Preview Frame */}
                                    <div className="hidden lg:flex flex-col items-center">
                                        <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 라이브 웹 미리보기
                                        </div>
                                        <div className="w-[340px] h-[680px] shrink-0 bg-white border-[8px] border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
                                            {/* Notch */}
                                            <div className="absolute top-0 w-full h-6 z-50 flex justify-center">
                                                <div className="w-32 h-5 bg-slate-800 rounded-b-2xl"></div>
                                            </div>

                                            {/* App Dynamic Header */}
                                            <div className="h-16 flex items-center justify-between px-5 text-white z-10 pt-5 transition-colors duration-300" style={{ backgroundColor: design.themeColor }}>
                                                <Menu size={22} className="opacity-90" />
                                                <span className="font-bold text-[17px] tracking-tight truncate flex-1 text-center px-2">{design.storeName}</span>
                                                <Bell size={20} className="opacity-90" />
                                            </div>

                                            {/* Notice Banner */}
                                            <div className="flex items-center px-4 py-2.5 shadow-sm relative z-0" style={{ backgroundColor: '#fff8f1' }}>
                                                <span className="font-bold text-[11px] mr-2 shrink-0 border px-1.5 py-0.5 rounded shadow-sm" style={{ color: design.themeColor, borderColor: design.themeColor }}>공지</span>
                                                <span className="text-xs text-slate-700 truncate flex-1 font-medium">{design.noticeText}</span>
                                            </div>

                                            {/* Tabs Scroll Area */}
                                            <div className="flex shadow-sm bg-white overflow-hidden border-b-2" style={{ borderBottomColor: `${design.themeColor}30` }}>
                                                {design.headerMenus.map((menu, i) => (
                                                    <button key={i} onClick={() => showToast('미리보기 화면입니다. 탭 전환은 실제 모바일 앱에서 가능합니다.')} className={`flex-1 py-3 text-center text-[12px] font-extrabold truncate px-1 transition-colors duration-300`}
                                                        style={{ backgroundColor: i === 0 ? design.themeColor : 'transparent', color: i === 0 ? 'white' : '#64748b' }}>
                                                        {menu}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* App Body Content View */}
                                            <div className="flex-1 bg-slate-50 overflow-y-auto pb-4">
                                                {/* Hero Image */}
                                                <div className="h-52 bg-slate-200 relative group overflow-hidden">
                                                    <img src={design.bannerImages[0] || 'https://images.unsplash.com/photo-1542314831-c6a4ca2cd9c5?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="banner" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-5">
                                                        <h2 className="text-white font-extrabold text-xl leading-tight text-shadow-sm mb-1">
                                                            환영합니다!<br />{design.storeName}입니다.
                                                        </h2>
                                                        <p className="text-slate-200 text-xs font-semibold">최고의 서비스를 고객님께 경험시켜 드릴게요.</p>
                                                    </div>
                                                </div>

                                                {/* Recommended */}
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                                                            <StoreIcon size={16} style={{ color: design.themeColor }} /> {design.attractionsTitle || '명소'}
                                                        </span>
                                                        <button onClick={() => showToast('실제 모바일 웹에서 동작합니다.')} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">더보기 <ChevronRight size={12} className="inline -ml-0.5" /></button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3.5">
                                                        {(design.attractions || []).map((item, id) => (
                                                            <button key={id} onClick={() => setZoomedImage(item.image)} className="text-left bg-white rounded-[1.25rem] shadow-sm border border-slate-100 overflow-hidden group active:scale-95 transition-transform">
                                                                <div className="h-[90px] bg-slate-100 overflow-hidden"><img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="product" /></div>
                                                                <div className="p-3 text-[12px] font-bold text-slate-700 truncate">{item.title}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quick Contact Component */}
                                                <div className="px-5">
                                                    <button onClick={() => showToast('고객센터 자동 연결 기능입니다. 미리보기에선 동작하지 않습니다.')} className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform">
                                                        <div className="text-left">
                                                            <p className="text-xs text-slate-400 font-bold mb-0.5">고객센터 / 문의</p>
                                                            <p className="text-sm font-extrabold text-slate-700">{design.phone}</p>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: design.themeColor }}>
                                                            <Smartphone size={18} />
                                                        </div>
                                                    </button>
                                                </div>

                                                {/* Toast Notification */}
                                                {toastMessage && (
                                                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl text-[11px] font-bold animate-fade-in z-50 whitespace-nowrap">
                                                        {toastMessage}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } />
                            <Route path="boards" element={
                                <div className="animate-fade-in pb-10">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
                                                <ClipboardList className="text-primary" /> 게시판/리뷰 관리
                                            </h1>
                                            <p className="text-sm text-slate-500">모바일 앱의 게시글, 리뷰, 댓글을 체계적으로 관리합니다.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => showToast('신규 글 작성 창 열기')} className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-indigo-600 shadow-sm transition-colors cursor-pointer">게시글 작성</button>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex border-b border-slate-200 mb-6 gap-6">
                                        {['게시글 관리', '리뷰 관리', '댓글 관리', 'FAQ 관리'].map((tab, idx) => (
                                            <button key={idx} onClick={() => setActiveBoardTab(idx)} className={`py-3 text-sm font-extrabold border-b-2 transition-colors cursor-pointer ${activeBoardTab === idx ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        {/* Search Bar */}
                                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2">
                                            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-primary"><option>게시판명</option><option>제목</option><option>내용</option></select>
                                            <input type="text" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary" placeholder="검색어를 입력하세요" />
                                            <button className="px-4 py-2 bg-slate-600 text-white font-bold text-sm rounded-lg hover:bg-slate-700 cursor-pointer">검색</button>
                                        </div>

                                        {/* List View */}
                                        <div className="divide-y divide-slate-100">
                                            {activeBoardTab === 3 ? (
                                                <div className="p-6 bg-slate-50 text-slate-500">
                                                    <div className="flex justify-between items-center mb-5">
                                                        <h3 className="font-bold text-slate-800">등록된 FAQ (자주 묻는 질문)</h3>
                                                        <button onClick={() => showToast('FAQ 신규 등록 폼 열기')} className="px-3.5 py-1.5 bg-primary text-white text-[13px] font-bold rounded-lg shadow-sm hover:bg-indigo-600 transition-colors cursor-pointer">+ 신규 항목 등록</button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {[
                                                            { q: '매장 주차장은 어떻게 이용하나요?', a: '매장 건물 지하 1층~2층 주차장을 무료로 이용하실 수 있습니다. (기본 2시간 무료, 영수증 제시 시 추가 1시간)' },
                                                            { q: '예약 취소/변경은 언제까지 가능한가요?', a: '예약일 기준 1일 전 자정까지 앱을 통해 직접 취소 및 변경이 가능합니다. 당일 취소 시 위약금이 발생할 수 있습니다.' },
                                                            { q: '포인트 적립율이 어떻게 되나요?', a: `결제 금액의 3%가 ${design.storeName} 포인트로 적립되며, 1,000 포인트 이상 모였을 시 현장/앱에서 즉시 현금처럼 사용 가능합니다.` }
                                                        ].map((faq, i) => (
                                                            <div key={i} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:border-primary/30 transition-all group">
                                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                                                    <div className="font-extrabold text-slate-800 text-[15px] flex items-start gap-2 max-w-2xl"><span className="text-primary font-black">Q.</span> {faq.q}</div>
                                                                    <div className="flex gap-2 shrink-0 self-end sm:self-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => showToast('위치 변경')} className="text-[11px] px-2 py-1 hover:bg-slate-100 text-slate-500 rounded font-bold cursor-grab">↕ 이동</button>
                                                                        <button onClick={() => showToast('FAQ 수정 폼 열기')} className="text-[12px] px-3 py-1.5 border border-slate-200 text-slate-600 rounded bg-white font-bold hover:bg-slate-50 shadow-sm cursor-pointer">수정</button>
                                                                        <button onClick={() => showToast('삭제되었습니다.')} className="text-[12px] px-3 py-1.5 border border-rose-100 text-rose-500 rounded bg-rose-50/50 font-bold hover:bg-rose-50 shadow-sm cursor-pointer">삭제</button>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3 text-sm text-slate-600 font-medium pl-6 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100"><span className="text-indigo-400 font-black mr-2">A.</span> {faq.a}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : useAppStore.getState().stories.map((post) => (
                                                <div key={post.id} className="p-5 flex gap-4 hover:bg-slate-50/50 transition-colors">
                                                    {(activeBoardTab === 1 || activeBoardTab === 0) && post.img && (
                                                        <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200 hidden sm:block shadow-sm">
                                                            <img src={post.img} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-extrabold text-slate-800 text-base mb-1 items-center flex gap-2">
                                                                    {post.title}
                                                                    {post.hidden && <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold">비노출</span>}
                                                                </h3>
                                                                <p className="text-sm text-slate-600 line-clamp-2 mt-1">{activeBoardTab === 2 ? (post.comments?.[0]?.text || '이런 멋진 댓글이 달렸습니다...') : post.content}</p>
                                                            </div>
                                                            <div className="flex flex-col gap-1.5 items-end shrink-0 ml-4">
                                                                {activeBoardTab === 0 && (
                                                                    <button onClick={() => showToast('삭제되었습니다.')} className="text-xs font-bold px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 shadow-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"><span className="text-rose-500 text-lg leading-none">×</span> 삭제</button>
                                                                )}
                                                                {activeBoardTab === 1 && (
                                                                    <button onClick={() => showToast('비노출 상태가 변경되었습니다.')} className={`text-xs font-bold px-3 py-1.5 border ${post.hidden ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-600 bg-white'} rounded shadow-sm hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer`}>
                                                                        <div className={`w-3 h-3 rounded-full border ${post.hidden ? 'border-primary bg-primary' : 'border-slate-300 bg-white'}`}></div> 비노출
                                                                    </button>
                                                                )}
                                                                {activeBoardTab === 2 && (
                                                                    <div className="flex gap-1.5">
                                                                        <button onClick={() => showToast('삭제되었습니다.')} className="text-xs font-bold px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 shadow-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"><span className="text-rose-500 text-lg leading-none">×</span> 삭제</button>
                                                                        <button onClick={() => showToast('답변 폼 열기')} className="text-xs font-bold px-3 py-1.5 border border-slate-200 rounded bg-white text-slate-600 shadow-sm hover:bg-slate-50 flex items-center gap-1 cursor-pointer"><span className="text-emerald-500 text-sm leading-none">✎</span> 댓글</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-400 font-bold mt-3">
                                                            {post.author || 'Admin'} <span className="mx-1.5">|</span> {post.date}
                                                        </div>
                                                        {(activeBoardTab === 0 || activeBoardTab === 1) && (
                                                            <div className="mt-3.5 flex gap-2">
                                                                {activeBoardTab === 0 && <button onClick={() => showToast('게시글 폼 편집')} className="text-xs font-bold px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">⟳ 수정</button>}
                                                                <button onClick={() => showToast('게시글 답변 달기')} className="text-xs font-bold px-3 py-1.5 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">✎ 답변</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Pagination */}
                                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center">
                                            <div className="flex border border-slate-200 rounded shadow-sm overflow-hidden bg-white">
                                                <button className="px-3 py-1.5 text-sm font-bold text-slate-400 hover:bg-slate-50 border-r border-slate-200 cursor-pointer">{'<'}</button>
                                                <button className="px-3 py-1.5 text-sm font-bold text-primary bg-primary/5 border-r border-slate-200 cursor-pointer">1</button>
                                                <button className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 border-r border-slate-200 cursor-pointer">2</button>
                                                <button className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">3</button>
                                                <button className="px-3 py-1.5 text-sm font-bold text-slate-400 hover:bg-slate-50 border-l border-slate-200 cursor-pointer">{'>'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } />
                            <Route path="inquiries" element={
                                <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
                                    <div className="flex justify-between items-end mb-4 shrink-0">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2"><MailOpen className="text-primary" /> 예약/문의 및 신청서 관리</h1>
                                            <p className="text-sm text-slate-500">모바일에서 접수된 내역과 폼 양식을 관리합니다.</p>
                                        </div>
                                    </div>

                                    {/* Inquiries Tabs */}
                                    <div className="flex border-b border-slate-200 mb-6 gap-6 shrink-0">
                                        <button onClick={() => setActiveInquiryTab(0)} className={`py-3 text-sm font-extrabold border-b-2 transition-colors cursor-pointer ${activeInquiryTab === 0 ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>수신된 내역 (Inbox)</button>
                                        <button onClick={() => setActiveInquiryTab(1)} className={`py-3 text-sm font-extrabold border-b-2 transition-colors cursor-pointer ${activeInquiryTab === 1 ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>신청서 양식 설정 (Builder)</button>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto flex-1 relative">
                                        {activeInquiryTab === 1 ? (
                                            <div className="p-8 pb-20 animate-fade-in">
                                                <div className="max-w-4xl mx-auto border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                                                    <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
                                                        <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><ClipboardList size={20} className="text-primary" /> 신청서(예약/문의) 입력 폼 설정</h3>
                                                    </div>
                                                    <div className="p-6 md:p-8 space-y-4 bg-slate-50/50">
                                                        {[
                                                            { label: '작성자 이름', type: 'text', req: true, show: true },
                                                            { label: '연락처 (휴대폰)', type: 'tel', req: true, show: true },
                                                            { label: '신청 시간/선호 일정', type: 'datetime', req: false, show: true },
                                                            { label: '문의 분류/옵션 선택 (ex: 포장/매장)', type: 'select', req: true, show: true },
                                                            { label: '주소/배송지 입력', type: 'text', req: false, show: false },
                                                            { label: '추가 요청사항 (자유기재)', type: 'textarea', req: false, show: true }
                                                        ].map((field, i) => (
                                                            <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${field.show ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                                                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                                    <div className="text-slate-300 cursor-grab hover:text-slate-500 px-1">⋮⋮</div>
                                                                    <div>
                                                                        <div className="font-bold text-[15px] text-slate-800">{field.label}</div>
                                                                        <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{field.type} FIELD</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-5 sm:gap-6 pl-10 sm:pl-0">
                                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer select-none">
                                                                        <input type="checkbox" defaultChecked={field.req} className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" /> 필수항목
                                                                    </label>
                                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer select-none">
                                                                        <input type="checkbox" defaultChecked={field.show} className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" /> 노출
                                                                    </label>
                                                                    <button onClick={() => showToast('항목 상세 설정 패널')} className="text-[13px] font-bold text-slate-500 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm hover:text-slate-700 hover:bg-slate-100 transition-colors">설정</button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <button onClick={() => showToast('새 항목 디자인 요소 추가')} className="w-full py-5 mt-4 border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-50 hover:border-primary/50 hover:text-primary transition-all cursor-pointer flex items-center justify-center gap-2"><span className="text-lg leading-none mb-0.5">+</span> 사용자 정의 필드 추가하기</button>
                                                    </div>
                                                    <div className="bg-white border-t border-slate-200 p-5 shrink-0 flex justify-end gap-3 bottom-0 sticky shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
                                                        <button className="px-6 py-2.5 font-bold text-[14px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer" onClick={() => setActiveInquiryTab(0)}>서식 초기화</button>
                                                        <button onClick={() => { showToast('폼 양식이 저장되었습니다. 모바일 앱에 즉시 배포됩니다.'); setActiveInquiryTab(0); }} className="px-6 py-2.5 font-bold text-[14px] bg-primary hover:bg-indigo-600 text-white rounded-lg shadow-[0_4px_10px_-2px_var(--color-primary)] transition-all cursor-pointer">설정 저장 및 배포</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : inquiries.length > 0 ? (
                                            <div className="divide-y divide-slate-100">
                                                {inquiries.map((inq: any) => (
                                                    <div key={inq.id} className="p-6 hover:bg-slate-50 transition-colors animate-fade-in">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">신규 접수 건</span>
                                                            <span className="text-slate-400 font-bold text-sm tracking-tight">{new Date(inq.date).toLocaleString()}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                                            {Object.entries(inq.fields || inq).filter(([k]) => k !== 'id' && k !== 'date').map(([key, val]) => (
                                                                <div key={key}>
                                                                    <div className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {key}
                                                                    </div>
                                                                    <div className="text-[15px] font-bold text-slate-800 break-all">{String(val)}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-5 flex gap-2.5">
                                                            <button onClick={() => showToast('카카오톡 알림톡으로 답변 전송 화면이 연동됩니다.')} className="px-5 py-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#371D1E] rounded-xl text-[13px] font-extrabold shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
                                                                <MailOpen size={16} /> 알림톡 답변하기
                                                            </button>
                                                            <button className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-[13px] font-bold transition-all active:scale-95 cursor-pointer">처리 완료 및 보관</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in h-[300px]">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <ClipboardList size={28} className="text-slate-300" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-700 mb-2">접수된 내역이 없습니다</h3>
                                                <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                                                    모바일 앱의 [문의 및 예약] 탭에서 폼을 제출해보세요.<br />접수 즉시 이곳에 나타납니다.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            } />

                            {/* HQ Specific Routes */}
                            <Route path="hq/franchisees" element={
                                <div className="animate-fade-in space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"><StoreIcon size={24} className="text-primary" /> 전체 가맹점 관리</h1>
                                            <p className="text-sm text-slate-500 mt-1">전국 가맹점의 운영 현황 및 앱 배포 상태를 관리합니다.</p>
                                        </div>
                                        <button onClick={() => showToast('신규 가맹점 등록 페이지로 이동합니다.')} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all cursor-pointer font-black">+ 가맹점 추가</button>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
                                            <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-primary cursor-pointer"><option>전체 지역</option><option>서울</option><option>경기</option></select>
                                            <div className="flex-1 relative"><input className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-primary" placeholder="가맹점명 또는 대표자명 검색" /></div>
                                        </div>
                                        <table className="w-full text-left border-collapse">
                                            <thead><tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100"><th className="px-6 py-4">가맹점명</th><th className="px-6 py-4">등록일</th><th className="px-6 py-4">상태</th><th className="px-6 py-4 text-right">매장앱 가기</th></tr></thead>
                                            <tbody className="text-sm font-medium text-slate-600 divide-y divide-slate-50">
                                                {[
                                                    { name: '이지택스 강남점', date: '2024.03.01', status: '운영중' },
                                                    { name: '이지택스 홍대점', date: '2024.03.15', status: '운영중' },
                                                    { name: '이지택스 부산서면점', date: '2024.04.05', status: '대기중' },
                                                    { name: '이지택스 대구중앙점', date: '2024.04.12', status: '점검중' }
                                                ].map((store, i) => (
                                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-800">{store.name}</td>
                                                        <td className="px-6 py-4 text-slate-400 text-xs">{store.date}</td>
                                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[9px] font-black ${store.status === '운영중' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{store.status}</span></td>
                                                        <td className="px-6 py-4 text-right"><button onClick={() => { setAdminRole('STORE'); showToast(`${store.name} 관리자로 전환되었습니다.`); }} className="text-primary hover:underline text-[11px] font-extrabold cursor-pointer">전환관리</button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            } />

                            <Route path="hq/templates" element={
                                <div className="animate-fade-in space-y-6 max-w-4xl">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"><Palette size={24} className="text-primary" /> 공통 앱 템플릿 배포 (이사/팀장 전용)</h1>
                                        <p className="text-sm text-slate-500 mt-1">본사 표준 디자인 설정을 전국 가맹점에 일괄 적용합니다.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                    <Palette size={20} />
                                                </div>
                                                <h3 className="font-extrabold text-slate-800 tracking-tight">디자인 테마 일괄 배포</h3>
                                            </div>
                                            <p className="text-[13px] text-slate-500 mb-6 font-medium leading-relaxed">
                                                현재 본사 관리자에서 설정된 모든 앱 디자인 요소(테마 컬러, 메인 배너, 탭 메뉴 등)를 전국의 모든 가맹점 모바일 앱에 일괄 적용합니다.
                                            </p>

                                            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">배포 예정 항목</p>
                                                <ul className="space-y-2">
                                                    {['브랜드 테마 컬러', '메인 로고 및 배너', '카테고리 메뉴 구성', '글꼴 및 아이콘 스타일'].map((item, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                            <div className="w-1 h-1 bg-indigo-400 rounded-full"></div> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <button
                                                onClick={() => { if (confirm('전국 가맹점의 디자인 설정을 본사 기준으로 초기화하시겠습니까?')) showToast('디자인 테마가 전 가맹점에 배포되었습니다.'); }}
                                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all cursor-pointer text-[15px] flex items-center justify-center gap-2"
                                            >
                                                <Palette size={18} /> 본사 디자인 일괄 배포
                                            </button>
                                        </div>
                                        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                    <Bell size={20} />
                                                </div>
                                                <h3 className="font-extrabold text-slate-800 tracking-tight">공통 공지사항 배포</h3>
                                            </div>
                                            <p className="text-[13px] text-slate-500 mb-6 font-medium leading-relaxed">
                                                본사 차원의 중요 브랜드 공지나 서비스 가이드라인을 전국 가맹점 앱의 [공지사항] 탭에 즉시 업로드합니다.
                                            </p>

                                            <div className="space-y-4 mb-6 flex-1">
                                                <div>
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">공지 제목</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all font-bold text-slate-700"
                                                        placeholder="예: [안내] 2024년 봄 시즌 메뉴 연출 가이드"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">공지 내용 요약</label>
                                                    <textarea
                                                        rows={3}
                                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all font-medium text-slate-600 resize-none"
                                                        placeholder="전국 지점에서 확인해야 할 핵심 내용을 기재하세요."
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => { if (confirm('작성하신 내용을 전국 가맹점에 일괄 배포하시겠습니까?')) showToast('공식 공지사항이 전사 배포되었습니다.'); }}
                                                className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black rounded-xl shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all cursor-pointer text-[15px] flex items-center justify-center gap-2"
                                            >
                                                <Zap size={18} className="fill-white" /> 본사 공식 공지 일괄 등록
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            } />

                            <Route path="hq/images" element={
                                <div className="animate-fade-in space-y-6 max-w-5xl">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"><Image size={24} className="text-primary" /> 본사 이미지/로고 브랜드 관리</h1>
                                        <p className="text-sm text-slate-500 mt-1">본사 공식 홈페이지 및 전국 가맹점 앱에 쓰일 브랜드 에셋을 한눈에 관리합니다.</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2"><Image size={18} className="text-primary" /> 브랜드 메인 로고 설정</div>
                                                <div className="p-6 space-y-6">
                                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                                        <div className="w-full md:w-48 h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-4 group hover:border-primary/50 transition-colors">
                                                            {design.logoImage ? (
                                                                <img src={design.logoImage} className="w-full h-full object-contain" alt="HQ Logo" />
                                                            ) : (
                                                                <>
                                                                    <Image size={32} className="text-slate-300 mb-2 group-hover:text-primary/50 transition-colors" />
                                                                    <p className="text-[11px] font-bold text-slate-400">이미지 미등록</p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div>
                                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">로고 이미지 URL</label>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={design.logoImage || ''}
                                                                        onChange={e => updateDesign({ logoImage: e.target.value })}
                                                                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-all"
                                                                        placeholder="https://..."
                                                                    />
                                                                    <button onClick={() => triggerUpload('logoImage')} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1 shrink-0 transition-colors"><Image size={14} /> 업로드</button>
                                                                </div>
                                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">* 가로형 로고 권장 (PNG/SVG, 배경 투명)</p>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <button onClick={() => showToast('로고 설정이 저장되었습니다.')} className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-lg shadow-sm hover:bg-indigo-600 transition-all">설정 저장</button>
                                                                <button onClick={() => updateDesign({ logoImage: '' })} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all">삭제</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2"><Smartphone size={18} className="text-primary" /> 모바일 앱 아이콘 및 배경</div>
                                                <div className="p-6 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">앱 바로가기 아이콘 (PWA)</label>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center shrink-0">
                                                                    {design.shortcutIcon ? <img src={design.shortcutIcon} className="w-12 h-12 rounded-xl" /> : <Smartphone size={24} className="text-slate-300" />}
                                                                </div>
                                                                <button onClick={() => triggerUpload('shortcutIcon')} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1"><Upload size={12} /> 아이콘 교체</button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">모바일 상단 배경 이미지</label>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-center">
                                                                    {design.topBgImage ? <img src={design.topBgImage} className="w-full h-full object-cover" /> : <Image size={24} className="text-slate-300" />}
                                                                </div>
                                                                <button onClick={() => triggerUpload('topBgImage')} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1"><Upload size={12} /> 배경 교체</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                                                <h3 className="font-black text-lg mb-2 flex items-center gap-2"><Zap size={20} className="fill-white" /> 본사 로고 디자인 가이드</h3>
                                                <p className="text-xs text-white/80 font-medium leading-relaxed mb-6">
                                                    본사 로고는 가맹점 앱 리스트와 공식 홈페이지의 신뢰도를 결정짓는 핵심 요소입니다. 깨끗하고 전문적인 이미지를 위해 다음 권장 사항을 확인하세요.
                                                </p>
                                                <ul className="space-y-3">
                                                    {[
                                                        '최소 512x512px 이상의 고해상도',
                                                        '글자가 잘 보이며 배경이 없는 PNG',
                                                        '브랜드 컬러(#10b981)가 포함된 디자인',
                                                        '파일 용량 2MB 이하 권장'
                                                    ].map((item, id) => (
                                                        <li key={id} className="flex items-start gap-2 text-[11px] font-bold text-white/90">
                                                            <div className="w-1 h-1 bg-white rounded-full mt-1.5 shrink-0"></div> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                                <h3 className="font-extrabold text-slate-800 text-sm mb-4">현재 적용된 브랜드 에셋</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-400 font-bold">메인 로고</span>
                                                        <span className={`${design.logoImage ? 'text-emerald-500' : 'text-slate-300'} font-black`}>{design.logoImage ? '등록완료' : '미등록'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-400 font-bold">앱 아이콘</span>
                                                        <span className={`${design.shortcutIcon ? 'text-emerald-500' : 'text-slate-300'} font-black`}>{design.shortcutIcon ? '등록완료' : '미등록'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-400 font-bold">상단 배경</span>
                                                        <span className={`${design.topBgImage ? 'text-emerald-500' : 'text-slate-300'} font-black`}>{design.topBgImage ? '등록완료' : '미등록'}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setIsPreviewModalOpen(true)} className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-600 transition-all flex items-center justify-center gap-2">
                                                    <Smartphone size={14} /> 실시간 앱 미리보기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } />

                            <Route path="hq/sales" element={
                                <div className="animate-fade-in space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2"><PieChart size={24} className="text-primary" /> 전사 매출 통계</h1>
                                            <p className="text-sm text-slate-500 mt-1">전국 가맹점의 통합 매출 현황과 성과 지표를 실시간으로 집계합니다.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm cursor-pointer">엑셀 내려받기</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                            <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-tight">금주 총 거래액 (전사)</p>
                                            <p className="text-3xl font-black text-slate-800">₩428,000,000</p>
                                            <p className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1">▲ 14.2% <span className="text-slate-400 font-medium">전주 대비</span></p>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                            <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-tight">평균 지점 객단가</p>
                                            <p className="text-3xl font-black text-slate-800">₩153,000</p>
                                            <p className="text-[11px] font-bold text-rose-500 mt-2 flex items-center gap-1">▼ 1.5% <span className="text-slate-400 font-medium">전주 대비</span></p>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                            <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-tight">본사 정산 수수료 (예상)</p>
                                            <p className="text-3xl font-black text-primary">₩21,400,000</p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-2 font-medium">실시간 정산 대기중</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">매출 성장 추이</h3>
                                                    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Real-time Performance</p>
                                                </div>
                                                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 ml-4">
                                                    <button onClick={() => setSalesTab('MONTH')} className={`px-5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${salesTab === 'MONTH' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>월별</button>
                                                    <button onClick={() => setSalesTab('YEAR')} className={`px-5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${salesTab === 'YEAR' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>년도별</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-200"></div> <span className="text-slate-400">지난 기간</span></div>
                                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500 shadow-lg shadow-emerald-200/50"></div> <span className="text-emerald-700">현재 매출</span></div>
                                            </div>
                                        </div>

                                        <div className="h-72 flex items-end justify-between px-2 relative">
                                            {/* Y-axis labels */}
                                            <div className="absolute left-0 h-full flex flex-col justify-between text-[11px] font-black text-slate-300 pointer-events-none pb-8 text-right pr-2">
                                                <span>10억</span><span>7.5억</span><span>5억</span><span>2.5억</span><span>0</span>
                                            </div>

                                            {/* Grid Lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pl-14 pr-4">
                                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full border-t border-slate-50 h-0"></div>)}
                                            </div>

                                            {/* Dynamic Bars */}
                                            {salesTab === 'MONTH' ? (
                                                ['10월', '11월', '12월', '1월', '2월', '3월'].map((month, i) => {
                                                    const heights = [45, 52, 78, 65, 58, 88];
                                                    const prevHeights = [40, 48, 70, 60, 55, 75];
                                                    return (
                                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end px-1 md:px-2">
                                                            <div className="flex items-end gap-2 h-[180px]">
                                                                <div
                                                                    className="w-1.5 md:w-3 bg-slate-200 rounded-lg group-hover:bg-slate-300 transition-all duration-700"
                                                                    style={{ height: `${prevHeights[i]}%` }}
                                                                ></div>
                                                                <div
                                                                    className="w-4 md:w-8 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-200/40 group-hover:bg-emerald-400 transition-all duration-500 relative"
                                                                    style={{ height: `${heights[i]}%` }}
                                                                >
                                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap font-black z-10 shadow-xl border border-white/10 scale-90 group-hover:scale-100">
                                                                        ₩{(heights[i] * 10).toLocaleString()}만
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="text-[12px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors mt-2">{month}</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                ['2019', '2020', '2021', '2022', '2023', '2024'].map((year, i) => {
                                                    const heights = [30, 45, 58, 62, 85, 95];
                                                    return (
                                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end px-2 md:px-4">
                                                            <div className="w-8 md:w-16 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200/50 group-hover:bg-emerald-400 transition-all duration-500 relative" style={{ height: `${heights[i]}%` }}>
                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap font-black">
                                                                    ₩{(heights[i] * 1.2).toFixed(1)}억
                                                                </div>
                                                            </div>
                                                            <span className="text-[12px] font-black text-slate-400 mt-2">{year}</span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-6">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">지점별 매출 랭킹 (TOP 3)</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { rank: 1, name: '강남점', total: '1.2억', grow: '+12%' },
                                                    { rank: 2, name: '홍대점', total: '9,800만', grow: '+8%' },
                                                    { rank: 3, name: '부산본점', total: '8,500만', grow: '+15%' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>{item.rank}</span>
                                                            <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-black text-slate-800">₩{item.total}</p>
                                                            <p className="text-[10px] font-bold text-emerald-500">{item.grow}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
                                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-100/50">
                                                <Zap size={28} className="fill-emerald-600 shadow-lg" />
                                            </div>
                                            <h4 className="text-sm font-black text-slate-800 mb-1.5">매출 AI 자동 분석</h4>
                                            <p className="text-[12px] text-slate-500 font-bold leading-relaxed">
                                                전년 동기 대비 거래액이 <span className="text-emerald-600 font-black tracking-tighter">24% 초과 성장</span> 중입니다.<br />
                                                <span className="text-[11px] text-slate-400 font-medium font-sans">특히 봄 시즌 디자인 배포 이후 가맹점 유입이 18% 증가했습니다.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            } />

                            {/* 🚀 New Management Pages */}
                            <Route path="customers" element={
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                                <Users size={24} className="text-primary" /> 고객관리
                                            </h1>
                                            <p className="text-sm text-slate-500 mt-1">우리 매장을 방문한 소중한 고객님들의 정보를 통합 관리합니다.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-all">엑셀 다운로드</button>
                                            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all flex items-center gap-2">
                                                <Plus size={16} /> 신규 고객 등록
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats for Customers */}
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { label: '전체 고객', value: '1,284명', icon: <Users size={18} />, color: 'blue' },
                                            { label: '이달의 신규', value: '42명', icon: <Plus size={18} />, color: 'emerald' },
                                            { label: '단골 고객(VIP)', value: '312명', icon: <Heart size={18} />, color: 'rose' },
                                            { label: '평균 재방문율', value: '68%', icon: <Zap size={18} />, color: 'amber' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-${stat.color}-500 bg-${stat.color}-50`}>{stat.icon}</div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">{stat.label}</p>
                                                    <p className="text-xl font-black text-slate-800">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Customer Table */}
                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <h3 className="font-black text-slate-800">고객 명단 (최근 방문순)</h3>
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                                    <input type="text" placeholder="이름, 연락처 검색" className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-64" />
                                                </div>
                                            </div>
                                        </div>
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4">고객명</th>
                                                    <th className="px-6 py-4">연락처</th>
                                                    <th className="px-6 py-4">최근 방문일</th>
                                                    <th className="px-6 py-4">누적 방문</th>
                                                    <th className="px-6 py-4">포인트</th>
                                                    <th className="px-6 py-4">상태</th>
                                                    <th className="px-6 py-4">관리</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {[
                                                    { name: '김태희', phone: '010-1234-5678', last: '2024-03-31', count: 12, point: '12,500P', status: 'VIP' },
                                                    { name: '이영희', phone: '010-9876-5432', last: '2024-03-30', count: 5, point: '4,200P', status: '일반' },
                                                    { name: '박지성', phone: '010-5555-4444', last: '2024-03-29', count: 2, point: '1,000P', status: '신규' },
                                                    { name: '홍길동', phone: '010-1111-2222', last: '2024-03-28', count: 24, point: '58,000P', status: 'VIP' },
                                                ].map((c, i) => (
                                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                                                        <td className="px-6 py-4 text-slate-500">{c.phone}</td>
                                                        <td className="px-6 py-4 text-slate-500">{c.last}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-700">{c.count}회</td>
                                                        <td className="px-6 py-4 text-primary font-bold">{c.point}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black ${c.status === 'VIP' ? 'bg-rose-50 text-rose-500' : c.status === '신규' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-400 capitalize hover:text-primary cursor-pointer font-bold text-xs">상세보기</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            } />

                            <Route path="reservations" element={
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                                <Calendar size={24} className="text-primary" /> 예약관리
                                            </h1>
                                            <p className="text-sm text-slate-500 mt-1">오늘의 예약 스케줄과 예약 신청 내역을 관리합니다.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all flex items-center gap-2">
                                                <Plus size={16} /> 예약 수동 등록
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        {/* Reservation Timeline Mock */}
                                        <div className="col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-extrabold text-slate-800">실시간 예약 스케줄 (오늘)</h3>
                                                <span className="text-xs font-bold text-slate-400">2024년 3월 31일 (수)</span>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { time: '13:00', name: '김태희 고객님', service: '풀염색 + 컷트', staff: '민지 수석디자이너', status: '시술중' },
                                                    { time: '14:30', name: '이영희 고객님', service: '볼륨 셋팅펌', staff: '제니 디자이너', status: '대기중' },
                                                    { time: '16:00', name: '박지성 고객님', service: '남성 커트', staff: '민지 수석디자이너', status: '확정됨' },
                                                    { time: '17:00', name: '홍길동 고객님', service: '두피 스케일링', staff: '제니 디자이너', status: '확정됨' },
                                                ].map((r, i) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <div className="w-16 pt-1 text-xs font-black text-slate-400 group-hover:text-primary transition-colors">{r.time}</div>
                                                        <div className={`flex-1 p-4 rounded-2xl border ${r.status === '시술중' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'} group-hover:shadow-md transition-all`}>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-800 mb-1">{r.name}</p>
                                                                    <p className="text-[11px] text-slate-500 font-bold mb-2">{r.service} | {r.staff}</p>
                                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${r.status === '시술중' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span>
                                                                </div>
                                                                <button className="text-[11px] font-black text-slate-400 hover:text-slate-800">수정</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* New Requests */}
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                                            <h3 className="font-extrabold text-slate-800 mb-6">신규 예약 신청 <span className="text-rose-500 ml-1">2</span></h3>
                                            <div className="space-y-3 flex-1 overflow-y-auto">
                                                {[
                                                    { name: '최강희', date: '04.02 (금)', service: '클리닉' },
                                                    { name: '정우성', date: '04.03 (토)', service: '다운펌' }
                                                ].map((req, i) => (
                                                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-xs font-black text-slate-800">{req.name} 고객님</span>
                                                            <span className="text-[10px] font-bold text-primary">{req.date}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 font-medium mb-3">{req.service} 신청하였습니다.</p>
                                                        <div className="flex gap-2">
                                                            <button className="flex-1 py-1.5 bg-primary text-white text-[10px] font-black rounded-lg shadow-sm">수락</button>
                                                            <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-400 text-[10px] font-black rounded-lg">거절</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } />

                            <Route path="staff" element={
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                                <UserCheck size={24} className="text-primary" /> 직원관리
                                            </h1>
                                            <p className="text-sm text-slate-500 mt-1">함께 일하는 매장 가족들의 근태와 실적, 급여를 관리합니다.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all flex items-center gap-2">
                                                <Plus size={16} /> 신규 직원 초대
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-6">
                                        {[
                                            { name: '강민지', role: '수석 디자이너', status: '근무중', sales: '840만', incentive: '84만', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
                                            { name: '임제니', role: '디자이너', status: '근무중', sales: '620만', incentive: '52만', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
                                            { name: '이로사', role: '인턴', status: '휴무', sales: '140만', incentive: '5만', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
                                            { name: '박해린', role: '매니저', status: '근무중', sales: '-', incentive: '-', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=100' },
                                        ].map((staff, i) => (
                                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center relative overflow-hidden group">
                                                <div className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-black tracking-widest ${staff.status === '근무중' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{staff.status}</div>
                                                <div className="w-20 h-20 mx-auto mb-4 rounded-full p-1 border-2 border-slate-50 overflow-hidden">
                                                    <img src={staff.image} className="w-full h-full object-cover rounded-full" alt="staff" />
                                                </div>
                                                <h4 className="font-extrabold text-slate-800 text-lg">{staff.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 mb-4">{staff.role}</p>
                                                <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">매출 기여</p>
                                                        <p className="text-xs font-black text-slate-800">{staff.sales}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">인센티브</p>
                                                        <p className="text-xs font-black text-emerald-600">{staff.incentive}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-5 flex gap-2">
                                                    <button className="flex-1 py-1.5 bg-slate-800 text-white text-[10px] font-black rounded-lg">근태기록</button>
                                                    <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-400 text-[10px] font-black rounded-lg group-hover:text-slate-800 group-hover:border-slate-300 transition-colors">설정</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </div>
                </div >
            </main >

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {
                toastMessage && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-900/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-2xl animate-slide-in-up flex items-center gap-3 border border-white/10 min-w-[320px] justify-center">
                        <Zap size={20} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-[15px] tracking-tight">{toastMessage}</span>
                    </div>
                )
            }

            {/* 📱 Live Preview Modal */}
            {
                isPreviewModalOpen && (
                    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsPreviewModalOpen(false)}></div>
                        <div className="relative animate-scale-up flex flex-col items-center">
                            <div className="flex items-center justify-between w-full mb-3 px-4">
                                <div className="flex items-center gap-2 text-white/90">
                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                                    <span className="text-sm font-black tracking-tighter">LIVE PREVIEW</span>
                                </div>
                                <button
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Phone Container (same as the inline one) */}
                            <div className="w-[320px] h-[640px] md:w-[350px] md:h-[700px] bg-slate-900 border-[10px] border-slate-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col scale-[0.95] md:scale-100 origin-top">
                                {/* Notch */}
                                <div className="absolute top-0 w-full h-7 z-50 flex justify-center">
                                    <div className="w-32 h-5 bg-slate-900 rounded-b-2xl"></div>
                                </div>

                                {/* Inner Screen */}
                                <div className="flex-1 bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                                    {/* Header */}
                                    <div className="h-16 flex items-center justify-between px-5 text-white z-10 pt-5 transition-colors duration-300" style={{ backgroundColor: design.themeColor }}>
                                        <Menu size={22} className="opacity-90" />
                                        <span className="font-extrabold text-[16px] tracking-tight truncate flex-1 text-center px-2">{design.storeName}</span>
                                        <Bell size={20} className="opacity-90" />
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 bg-slate-50 overflow-y-auto pb-4 custom-scrollbar">
                                        <div className="flex items-center px-4 py-2.5 shadow-sm relative z-0" style={{ backgroundColor: '#fff8f1' }}>
                                            <span className="font-bold text-[11px] mr-2 shrink-0 border px-1.5 py-0.5 rounded shadow-sm" style={{ color: design.themeColor, borderColor: design.themeColor }}>공지</span>
                                            <span className="text-[11px] text-slate-700 truncate flex-1 font-bold">{design.noticeText}</span>
                                        </div>

                                        <div className="flex shadow-sm bg-white overflow-hidden border-b" style={{ borderBottomColor: `${design.themeColor}20` }}>
                                            {design.headerMenus.map((menu, i) => (
                                                <button key={i} className={`flex-1 py-3 text-center text-[12px] font-black truncate px-1 transition-colors`}
                                                    style={{ backgroundColor: i === 0 ? design.themeColor : 'transparent', color: i === 0 ? 'white' : '#94a3b8' }}>
                                                    {menu}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                                            <img src={design.bannerImages[0] || 'https://images.unsplash.com/photo-1542314831-c6a4ca2cd9c5?w=600'} className="w-full h-full object-cover" alt="banner" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-5">
                                                <h2 className="text-white font-black text-lg leading-tight uppercase tracking-tighter">환영합니다!<br />{design.storeName}</h2>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-black text-[13px] text-slate-800 flex items-center gap-1.5">
                                                    <StoreIcon size={14} style={{ color: design.themeColor }} /> {design.attractionsTitle || '명소'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(design.attractions || []).map((item, id) => (
                                                    <div key={id} onClick={() => setZoomedImage(item.image)} className="text-left bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer active:scale-95 transition-transform">
                                                        <div className="h-24 bg-slate-100 overflow-hidden"><img src={item.image} className="w-full h-full object-cover" alt="product" /></div>
                                                        <div className="p-2.5 text-[11px] font-black text-slate-700 truncate">{item.title}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quick Contact Component */}
                                        <div className="px-4">
                                            <div className="w-full bg-white p-3.5 rounded-xl shadow-sm border border-slate-100">
                                                <p className="text-[10px] text-slate-400 font-bold mb-0.5">매장 문의</p>
                                                <p className="text-[13px] font-black text-slate-700">{design.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 📍 Floating Preview Button for Mobile/Tablet users */}
            <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] lg:hidden animate-bounce"
                style={{ animationDuration: '3s' }}
            >
                <Smartphone size={24} />
            </button>

            {/* 🖼️ Image Zoom Modal (Preview) */}
            {
                zoomedImage && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 animate-fade-in p-4" onClick={() => setZoomedImage(null)}>
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
                                <span className="text-emerald-400">● LIVE</span> 화면을 터치하면 닫힙니다
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
