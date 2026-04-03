import { useAppStore } from '../store';
import {
    ArrowRight,
    Phone,
    Mail,
    MapPin,
    CheckCircle2,
    ChevronRight,
    ShieldCheck,
    Crown,
    Sparkles,
    Star,
    Globe,
    Users,
    MousePointer2,
    Award,
    Gem
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Headquarters() {
    const { design, addInquiry } = useAppStore();

    const [partnerName, setPartnerName] = useState('');
    const [phone, setPhone] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
    const [activePolicy, setActivePolicy] = useState<{ title: string, content: string }>({ title: '', content: '' });
    const [activeCollection, setActiveCollection] = useState<{ title: string, image: string, desc: string } | null>(null);
    const [activePillar, setActivePillar] = useState<{ title: string, desc: string, detail: string } | null>(null);

    const policies = {
        privacy: {
            title: "Privacy Policy (개인정보처리방침)",
            content: `네일블리스(이하 '회사')는 고객님의 개인정보를 소중하게 보호합니다.

1. 수집하는 개인정보 항목
- 성함, 연락처, 업체명, 상담 문의 내용.

2. 개인정보 수집 및 이용 목적
- 파트너십 및 브랜드 가맹 상담, 본사 공지사항 전달.

3. 개인정보 보유 및 이용 기간
- 상담 신청일로부터 1년 또는 고객 요청 시 즉시 파기.

4. 동의 거부 권리
- 고객님은 개인정보 수집에 동의를 거부할 수 있으나, 이 경우 상담 신청이 제한될 수 있습니다.`
        },
        terms: {
            title: "Terms of Service (이용약관)",
            content: `네일블리스 플랫폼 및 브랜드 이용에 대한 약관입니다.

1. 지식재산권 보호
- 본 사이트 및 네일블리스 브랜드의 모든 디자인, 로고, 아트는 본사의 고유 자산이며 무단 복제 및 상업적 이용을 엄격히 금지합니다.

2. 서비스의 제공
- 본사는 파트너에게 브랜드 교육, 자재 공급, 마케팅 지원을 표준 계약에 의거하여 제공합니다.

3. 이용자의 의무
- 이용자는 본사의 브랜드 가치를 훼손하는 행위를 해서는 안 되며, 정해진 매뉴얼에 따라 서비스를 운영해야 합니다.`
        },
        franchise: {
            title: "Franchise Policy (가맹 정책)",
            content: `네일블리스만의 독보적인 가맹 지원 시스템입니다.

1. 상권 보호 시스템
- 지점 간 거리 제한 및 독점 영업권을 확실히 보장하여 파트너의 수익성을 극대화합니다.

2. 마스터 교육 수료 필수
- 네일블리스 본사 아카데미의 8단계 마스터 코스를 이수한 디렉터만이 지점을 운영할 수 있습니다.

3. 브랜딩 통합 관리
- 인테리어, 자재, 유니폼, 마케팅 시안 등 모든 브랜딩 요소를 본사에서 직접 큐레이션하여 프리미엄 퀄리티를 유지합니다.`
        }
    };

    const openPolicy = (type: 'privacy' | 'terms' | 'franchise') => {
        setActivePolicy(policies[type]);
        setIsPolicyModalOpen(true);
    };

    const handleInquirySubmit = (e: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!phone || !partnerName) {
            alert('상담 신청을 위해 성함과 연락처를 모두 입력해주세요.');
            return;
        }

        addInquiry({
            title: "네일블리스 파트너십/가맹 상담 신청",
            "신청자명": partnerName,
            "연락처": phone,
            "유형": "본사 다이렉트 상담",
            "상태": "대기중"
        });

        alert('신청이 성공적으로 접수되었습니다.\n본사 글로벌 사업본부장이 확인 후 신속히 연락드리겠습니다.');
        setPartnerName('');
        setPhone('');
        setIsModalOpen(false);
    };

    // Smooth scroll for anchor links
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    const scrollToSection = (id: string, e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        const element = document.getElementById(id);
        const headerOffset = 80;
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const pillars = [
        {
            title: "Unrivaled Artistry",
            subtitle: "비교 불가능한 예술적 감각",
            desc: "단순한 관리를 넘어 손끝에 생명력을 불어넣는 아트를 지향합니다. 시즌별 독창적인 컬렉션으로 트렌드를 선도합니다.",
            icon: Gem,
            color: "from-[#d4af37] to-[#f9d423]",
            tags: ["1:1 Private Art", "Season Collection", "Master Series"]
        },
        {
            title: "Absolute Hygiene",
            subtitle: "타협 없는 위생의 정석",
            desc: "의료 기기 수준의 멸균 시스템과 1인 1킷 원칙을 고수합니다. 고객의 건강이 최고의 아름다움이라는 믿음을 실천합니다.",
            icon: ShieldCheck,
            color: "from-emerald-400 to-cyan-500",
            tags: ["Medical Sterilization", "1:1 Kit System", "Clean Lab"]
        },
        {
            title: "Global Trend HQ",
            subtitle: "글로벌 트렌드의 중심",
            desc: "전 세계 프리미엄 네일 시장의 흐름을 분석하고 선도하는 본사 시스템을 통해, 어디서나 동일한 최상의 가치를 제공합니다.",
            icon: Globe,
            color: "from-indigo-400 to-purple-500",
            tags: ["Market Analysis", "Brand Excellence", "Global Network"]
        }
    ];

    return (
        <div className="font-sans text-slate-100 bg-[#061a15] min-h-screen selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
            {/* Custom Animations Inline Styles */}
            <style>{`
                @keyframes shine-sweep {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shine-sweep {
                    animation: shine-sweep 3s infinite;
                }
                @keyframes pulse-gentle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-pulse-gentle {
                    animation: pulse-gentle 4s ease-in-out infinite;
                }
                @keyframes float-luxury {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float-luxury {
                    animation: float-luxury 6s ease-in-out infinite;
                }
                @keyframes gold-shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .gold-shimmer-text {
                    background: linear-gradient(90deg, #d4af37 0%, #f9d423 25%, #fff 50%, #f9d423 75%, #d4af37 100%);
                    background-size: 200% auto;
                    color: transparent;
                    -webkit-background-clip: text;
                    animation: gold-shimmer 5s linear infinite;
                }
            `}</style>

            {/* Premium Header */}
            <header className="fixed top-0 left-0 right-0 bg-[#061a15]/80 backdrop-blur-2xl border-b border-[#d4af37]/20 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 cursor-pointer group/nav-logo h-full"
                    >
                        {design.logoImage && (
                            <div className="relative group/logo-box">
                                {/* 3D Frame */}
                                <div className="bg-gradient-to-br from-white to-slate-50 p-1 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_4px_8px_rgba(0,0,0,0.25)] border border-[#FFD700]/60 relative z-20 transition-all duration-500 group-hover/logo-box:scale-105 group-hover/logo-box:shadow-[inset_0_2px_6px_rgba(255,255,255,1),0_8px_20px_rgba(0,0,0,0.35)]">
                                    <img
                                        src={design.logoImage}
                                        alt={design.storeName}
                                        className="h-8 w-auto object-contain brightness-110"
                                    />
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none"></div>
                                </div>
                                {/* Sparkle Aura */}
                                <div className="absolute -inset-2 bg-[#FFD700]/30 blur-2xl opacity-40 group-hover/logo-box:opacity-70 transition-opacity duration-700 rounded-full z-10 animate-pulse-gentle"></div>
                            </div>
                        )}
                        <span className="font-black text-2xl tracking-[0.05em] bg-clip-text text-transparent bg-gradient-to-b from-[#FFF] via-[#FFD700] to-[#B8860B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none [-webkit-text-stroke:0.5px_rgba(139,101,8,0.2)]">
                            {design.storeName}
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-10 font-bold text-sm tracking-widest uppercase">
                        <button onClick={(e) => scrollToSection('brand-story', e)} className="text-slate-400 hover:text-[#d4af37] transition-colors relative group">
                            Brand Story
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4af37] transition-all group-hover:w-full"></span>
                        </button>
                        <button onClick={(e) => scrollToSection('excellence', e)} className="text-slate-400 hover:text-[#d4af37] transition-colors relative group">
                            Excellence
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4af37] transition-all group-hover:w-full"></span>
                        </button>
                        <button onClick={(e) => scrollToSection('collections', e)} className="text-slate-400 hover:text-[#d4af37] transition-colors relative group">
                            Collections
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4af37] transition-all group-hover:w-full"></span>
                        </button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#f9d423] text-black font-black text-xs rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all hidden sm:block tracking-widest uppercase"
                        >
                            Partnership
                        </button>
                        <a href={`tel:${design.phone}`} className="p-2 text-[#d4af37] hover:bg-white/5 rounded-full transition-colors md:hidden">
                            <Phone size={20} />
                        </a>
                    </div>
                </div>
            </header>

            {/* Luxury Hero Section */}
            <section className="relative pt-40 pb-32 md:pt-60 md:pb-52 px-6 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-[#d4af37]/30 text-[#d4af37] font-bold text-xs rounded-full backdrop-blur-xl mb-8 animate-fade-in tracking-[0.2em] uppercase">
                        <Crown size={14} className="animate-bounce" />
                        Premium Nail Care Headquarters
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                        <span className="block text-white mb-2">THE ART OF</span>
                        <span className="gold-shimmer-text block pb-2">PERFECTION</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium max-w-3xl mb-12 animate-fade-in-up">
                        네일블리스는 평범함을 거부합니다. <br />
                        타협하지 않는 품질, 예술적 감각, 그리고 최상위 위생 시스템으로 <br />
                        대한민국 프리미엄 네일의 새로운 기준을 제시합니다.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#f9d423] text-black font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group tracking-tight"
                        >
                            브랜드 파트너십 문의 <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={(e) => scrollToSection('excellence', e)}
                            className="px-10 py-5 bg-white/5 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center hover:border-[#d4af37]/50"
                        >
                            컬렉션 둘러보기
                        </button>
                    </div>
                </div>

                {/* Floating 3D Assets Concept */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <MousePointer2 size={32} className="text-[#d4af37]" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* Brand Story Section                             */}
            {/* ═══════════════════════════════════════════════ */}
            <section id="brand-story" className="py-32 px-6 overflow-hidden relative">
                {/* Background Accents */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Section Header */}
                    <div className="text-center mb-24">
                        <p className="text-xs font-black text-[#d4af37] tracking-[0.4em] uppercase mb-4">Our Journey</p>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            네일블리스가 <span className="gold-shimmer-text">걸어온 길</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            손끝의 아름다움에 삶을 걸었습니다.<br />
                            하나의 꿈이 대한민국 프리미엄 네일의 기준이 되기까지의 이야기입니다.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-8" />
                    </div>

                    {/* Founder Message */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-28">
                        <div className="relative group">
                            {/* Glow Frame */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#d4af37]/20 to-emerald-500/10 rounded-[50px] blur-2xl opacity-60 group-hover:opacity-90 transition-opacity" />
                            <div className="relative rounded-[40px] overflow-hidden border border-[#d4af37]/20 shadow-2xl aspect-[4/3]">
                                <img
                                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000"
                                    alt="네일블리스 아트 스튜디오"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#061a15]/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <span className="inline-block px-4 py-2 bg-[#d4af37]/20 backdrop-blur-xl border border-[#d4af37]/30 rounded-full text-[#d4af37] text-xs font-black tracking-widest uppercase">
                                        ✦ Founded 2018 · Seoul, Korea
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full">
                                <Star size={14} className="text-[#d4af37] fill-[#d4af37]" />
                                <span className="text-[#d4af37] font-black text-xs tracking-widest uppercase">Founder's Message</span>
                            </div>
                            <blockquote className="text-3xl md:text-4xl font-black text-white leading-tight">
                                "네일은 단순한<br />
                                <span className="text-[#d4af37]">치장이 아닙니다.</span><br />
                                당신의 이야기입니다."
                            </blockquote>
                            <div className="space-y-5 text-slate-400 text-base leading-relaxed font-medium">
                                <p>
                                    2018년, 서울 강남 한 편의 작은 스튜디오에서 네일블리스는 출발했습니다.
                                    평범한 네일샵이 아닌, 고객 한 명 한 명의 개성을 예술로 승화시키는 공간을 만들겠다는 하나의 신념으로.
                                </p>
                                <p>
                                    우리는 6년간 타협하지 않았습니다. 최고급 자재, 의료 수준의 위생, 글로벌 트렌드 리서치.
                                    그리고 그 결과, 오늘날 전국 {'>'}50개 지점에서 수십만 명의 고객이 네일블리스를 선택하고 있습니다.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#f9d423] flex items-center justify-center font-black text-black text-xl shadow-xl">
                                    김
                                </div>
                                <div>
                                    <p className="font-black text-white text-base">김지수 대표이사</p>
                                    <p className="text-[#d4af37] text-xs font-bold tracking-wider">Founder & CEO, Nail Bliss HQ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-28">
                        {[
                            { num: '50+', label: '전국 지점', sub: 'Nationwide Branches', icon: '🏪' },
                            { num: '12만+', label: '누적 고객', sub: 'Total Clients Served', icon: '💅' },
                            { num: '6년', label: '브랜드 역사', sub: 'Years of Excellence', icon: '🏆' },
                            { num: '8관왕', label: '수상 이력', sub: 'Industry Awards', icon: '🥇' },
                        ].map((stat, i) => (
                            <div key={i} className="group relative bg-white/3 border border-white/8 hover:border-[#d4af37]/30 rounded-[28px] p-8 text-center transition-all duration-500 hover:-translate-y-1 cursor-default overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[28px]" />
                                <div className="text-3xl mb-3">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-black text-white mb-1 gold-shimmer-text">{stat.num}</div>
                                <div className="text-[#d4af37] font-black text-sm mb-1">{stat.label}</div>
                                <div className="text-slate-500 text-xs font-medium">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Brand Timeline */}
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-black text-white text-center mb-16">
                            <span className="gold-shimmer-text">브랜드 히스토리</span>
                        </h3>
                        <div className="relative">
                            {/* Centre Vertical Line */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37]/60 via-[#d4af37]/20 to-transparent hidden md:block" />
                            <div className="space-y-12">
                                {[
                                    { year: '2018', title: '네일블리스 1호점 오픈', desc: '서울 강남구 청담동에 첫 스튜디오를 오픈. 프리미엄 네일 케어의 새 패러다임을 제시했습니다.', side: 'left' },
                                    { year: '2020', title: 'Clean Lab 인증 획득', desc: '업계 최초 의료기기 멸균 시스템을 도입하고 독자적인 "Clean Lab" 위생 인증 체계를 구축했습니다.', side: 'right' },
                                    { year: '2022', title: '전국 가맹 사업 런칭', desc: '본사 직영 교육 아카데미를 설립하고 표준화된 가맹 시스템으로 전국 확장을 본격화했습니다.', side: 'left' },
                                    { year: '2024', title: '글로벌 트렌드 협약 체결', desc: '뉴욕·런던 프리미엄 네일 브랜드와 트렌드 리서치 파트너십을 체결, 글로벌 감각을 국내에 도입하고 있습니다.', side: 'right' },
                                ].map((item, i) => (
                                    <div key={i} className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="flex-1">
                                            <div className={`bg-white/3 border border-white/8 hover:border-[#d4af37]/25 rounded-[24px] p-8 transition-all duration-300 group hover:-translate-y-1 cursor-default ${item.side === 'right' ? 'md:text-right' : ''}`}>
                                                <span className="inline-block text-[#d4af37] font-black text-xs tracking-widest mb-3 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full px-4 py-1.5">{item.year}</span>
                                                <h4 className="text-xl font-black text-white mb-3">{item.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                        {/* Dot */}
                                        <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f9d423] items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] flex-shrink-0 z-10">
                                            <Star size={16} className="text-black fill-black" />
                                        </div>
                                        <div className="flex-1 md:block hidden" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Excellence Pillars Section */}
            <section id="excellence" className="py-32 px-6 bg-gradient-to-b from-[#061a15] to-[#04100d]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-sm font-black text-[#d4af37] tracking-[0.4em] uppercase mb-4">Our Excellence</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-8">성공을 위한 <span className="gold-shimmer-text">세 가지 약속</span></h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {pillars.map((pillar, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setActivePillar({
                                        title: pillar.title,
                                        desc: pillar.subtitle,
                                        detail: pillar.title === "Unrivaled Artistry" ? "네일블리스의 아티스트들은 단순한 시술을 넘어 고객의 개성을 예술로 승화시킵니다. 1:1 퍼스널 컬러 진단과 커스텀 디자인을 통해 세상에 하나뿐인 작품을 선사합니다." :
                                            pillar.title === "Absolute Hygiene" ? "우리는 의료기기 수준의 멸균 시스템을 업계 최초로 도입했습니다. 모든 도구는 1인 1기구 원칙을 준수하며, 투명한 위생 공정으로 고객의 건강을 최우선으로 생각합니다." :
                                                "글로벌 뷰티 트렌드의 중심인 뉴욕과 런던의 현지 아티스트들과 협업하여, 매 시즌 가장 앞선 트렌드를 한국 시장에 가장 먼저 제안합니다."
                                    });
                                    setIsPillarModalOpen(true);
                                }}
                                className="group relative cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px] -z-10 border border-white/10"></div>
                                <div className="p-12 h-full flex flex-col items-center text-center">
                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${pillar.color} text-black flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <pillar.icon size={36} />
                                    </div>
                                    <h5 className="text-[#d4af37] font-black text-xs tracking-tighter mb-2 uppercase">{pillar.title}</h5>
                                    <h4 className="text-2xl font-black text-white mb-6 group-hover:text-[#f9d423] transition-colors">{pillar.subtitle}</h4>
                                    <p className="text-slate-400 leading-relaxed font-medium mb-10 text-lg break-keep">{pillar.desc}</p>
                                    <div className="mt-auto flex flex-wrap justify-center gap-2">
                                        {pillar.tags.map((tag, j) => (
                                            <span key={j} className="px-4 py-1.5 bg-black/40 text-slate-300 text-[10px] font-black rounded-full border border-white/5 tracking-wider uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collection Preview Section */}
            <section id="collections" className="py-32 px-6 relative overflow-hidden bg-[#04100d]">
                {/* Background Shimmer */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
                    <div className="w-full lg:w-1/2">
                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37]/20 to-emerald-500/20 rounded-[50px] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity animate-float-luxury"></div>
                            <div
                                onClick={() => {
                                    setActiveCollection({
                                        title: "Emerald Gold Masterpiece",
                                        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000",
                                        desc: "네일블리스 본사 디자인 팀이 큐레이션한 이번 시즌 시그니처 컬렉션입니다. 에메랄드 베이스에 24K 골드 파우더를 믹스하여 오묘하고 깊이 있는 광택을 구현했습니다."
                                    });
                                    setIsCollectionModalOpen(true);
                                }}
                                className="relative overflow-hidden rounded-[40px] border border-white/10 shadow-3xl aspect-[4/5] cursor-pointer"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000"
                                    alt="Nail Art Masterpiece"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-[#d4af37] font-black tracking-widest text-sm mb-2">SEASON BEST</p>
                                    <h4 className="text-3xl font-black mb-4">Emerald Gold Masterpiece</h4>
                                    <div className="flex items-center gap-2">
                                        <Star className="text-[#f9d423]" size={16} fill="#f9d423" />
                                        <Star className="text-[#f9d423]" size={16} fill="#f9d423" />
                                        <Star className="text-[#f9d423]" size={16} fill="#f9d423" />
                                        <Star className="text-[#f9d423]" size={16} fill="#f9d423" />
                                        <Star className="text-[#f9d423]" size={16} fill="#f9d423" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <h2 className="text-sm font-black text-[#d4af37] tracking-[0.4em] uppercase mb-4">The Portfolio</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                            최고의 아트는<br />
                            <span className="gold-shimmer-text">디테일</span>에서 시작됩니다.
                        </h3>
                        <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium break-keep">
                            전 세계적으로 엄선된 프리미엄 젤과 본사 아카데미를 통과한 마스터들의 수작업이 만납니다. 네일블리스의 모든 디렉터는 글로벌 트렌드 코스를 이수한 최고의 전문가 집단입니다.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#d4af37]/30 transition-all">
                                <Award className="text-[#d4af37] mb-4" size={32} />
                                <h5 className="text-white font-black text-lg mb-2">프리미엄 원부자재</h5>
                                <p className="text-slate-500 text-sm font-medium">유독 성분 없는 안전한 글로벌 명품 브랜드 제품만을 고집합니다.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#d4af37]/30 transition-all">
                                <Users className="text-[#d4af37] mb-4" size={32} />
                                <h5 className="text-white font-black text-lg mb-2">직영 교육 시스템</h5>
                                <p className="text-slate-500 text-sm font-medium">본사 직속 아카데미를 통해 전국 어느 지점에서도 동일한 품질을 보장합니다.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-lg font-black text-[#d4af37] flex items-center gap-2 group hover:gap-4 transition-all"
                        >
                            브랜드 협업 제안하기 <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Partnership Section: High-End Inquiry Form */}
            <section id="partnership" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-[#0a2f26] to-[#061a15] rounded-[60px] p-10 md:p-24 border border-[#d4af37]/30 relative overflow-hidden shadow-2xl">
                        {/* Shimmer Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine-sweep"></div>

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                            <div className="lg:w-1/2">
                                <h2 className="text-sm font-black text-[#d4af37] tracking-[0.4em] uppercase mb-4">Partnership</h2>
                                <h3 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8">
                                    미래를 선도할<br />
                                    <span className="gold-shimmer-text">파트너를 기다립니다.</span>
                                </h3>
                                <p className="text-xl text-slate-400 mb-10 font-medium leading-relaxed">
                                    네일블리스의 브랜드 가치에 동참하고 함께 성장할 파트너십을 제안해주세요. 본사 전문가 팀이 성공적인 비즈니스 안착을 지원합니다.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-white font-bold">
                                        <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]"><CheckCircle2 size={20} /></div>
                                        <span>독보적인 지역 상권 보호 시스템</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white font-bold">
                                        <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]"><CheckCircle2 size={20} /></div>
                                        <span>본사 차원의 전사적 마케팅 지원</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white font-bold">
                                        <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]"><CheckCircle2 size={20} /></div>
                                        <span>시즌별 트렌드 아트 개발 및 교육 지원</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-[450px] w-full">
                                <div className="bg-[#04100d]/60 backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                                    <h4 className="text-2xl font-black text-white mb-8 text-center">퀵 상담 신청</h4>
                                    <form onSubmit={handleInquirySubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#d4af37] uppercase tracking-widest pl-1">성함 / 업체명</label>
                                            <input
                                                type="text"
                                                value={partnerName}
                                                onChange={e => setPartnerName(e.target.value)}
                                                placeholder="예: 홍길동 마스터"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-[#d4af37] uppercase tracking-widest pl-1">연락처</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                placeholder="010-1234-5678"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-bold"
                                            />
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-[#d4af37] to-[#f9d423] text-black font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-3 text-lg">
                                            상담 신청 완료 <MousePointer2 size={20} />
                                        </button>
                                        <p className="text-[10px] text-slate-500 text-center mt-6 leading-relaxed">
                                            신청 시 네일블리스의 개인정보취급방침에 동의한 것으로 간주되며, <br /> 사업본부 상담원으로부터 상담 전화가 발신됩니다.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#020806] text-slate-500 py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                        <div className="space-y-6 max-w-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-1 bg-gradient-to-br from-white to-slate-200 rounded-lg shadow-lg border border-[#d4af37]/30">
                                    <img src={design.logoImage} alt="Logo" className="h-6 w-auto" />
                                </div>
                                <span className="text-2xl font-black text-white tracking-widest">{design.storeName}</span>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                {design.storeName}는 고객의 건강과 아름다움을 최우선으로 생각하는 글로벌 프리미엄 네일 브랜드입니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
                            <div className="space-y-6">
                                <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Explore</h4>
                                <ul className="space-y-4 text-sm font-bold">
                                    <li><button onClick={() => scrollToSection('brand-story')} className="hover:text-[#d4af37] transition-colors">Brand Story</button></li>
                                    <li><button onClick={() => scrollToSection('excellence')} className="hover:text-[#d4af37] transition-colors">Excellence</button></li>
                                    <li><button onClick={() => scrollToSection('collections')} className="hover:text-[#d4af37] transition-colors">Collections</button></li>
                                    <li><button onClick={() => scrollToSection('partnership')} className="hover:text-[#d4af37] transition-colors">Partnership</button></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Policy</h4>
                                <ul className="space-y-4 text-sm font-bold">
                                    <li><button onClick={() => openPolicy('privacy')} className="hover:text-[#d4af37] transition-colors">Privacy Policy</button></li>
                                    <li><button onClick={() => openPolicy('terms')} className="hover:text-[#d4af37] transition-colors">Terms of Service</button></li>
                                    <li><button onClick={() => openPolicy('franchise')} className="hover:text-[#d4af37] transition-colors">Franchise Policy</button></li>
                                </ul>
                            </div>
                            <div className="space-y-6 col-span-2 sm:col-span-1">
                                <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Contact Us</h4>
                                <ul className="space-y-4 text-sm font-bold">
                                    <li><a href={`tel:${design.phone}`} className="flex items-center gap-2 hover:text-[#d4af37] group"><Phone size={14} className="text-[#d4af37]" /> {design.phone}</a></li>
                                    <li><a href={`mailto:${design.email}`} className="flex items-center gap-2 hover:text-[#d4af37] group"><Mail size={14} className="text-[#d4af37]" /> {design.email}</a></li>
                                    <li><div className="flex items-center gap-2 text-slate-400"><MapPin size={14} className="text-[#d4af37] shrink-0" /> {design.address}</div></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold tracking-widest text-[#d4af37]/40 uppercase">
                        <p>© {new Date().getFullYear()} {design.storeName} GLOBAL HEADQUARTERS. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8">
                            <span className="cursor-pointer hover:text-[#d4af37]">Instagram</span>
                            <span className="cursor-pointer hover:text-[#d4af37]">Behance</span>
                            <span className="cursor-pointer hover:text-[#d4af37]">Pinterest</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Partnership Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-[#061a15] border border-[#d4af37]/30 w-full max-w-xl rounded-[40px] overflow-hidden shadow-3xl animate-slide-in-up">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-[#d4af37] transition-colors p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#d4af37]/30 group">
                                <XMarkIcon className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                        <div className="p-10 md:p-16">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37] to-[#f9d423] rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-[#d4af37]/20">
                                <Crown size={40} className="text-black" />
                            </div>
                            <h3 className="text-4xl font-black text-white mb-4 leading-tight">Partner Partnership Inquiry</h3>
                            <p className="text-slate-400 font-medium mb-10 text-lg">성함과 연락처를 남겨주시면 본사 글로벌 사업본부에서 <br /> 24시간 이내에 직접 연락을 드립니다.</p>

                            <form className="space-y-6" onSubmit={(e) => handleInquirySubmit(e)}>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-[#d4af37] uppercase tracking-[0.2em] pl-1">성함 / 담당자명</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={partnerName}
                                        onChange={e => setPartnerName(e.target.value)}
                                        placeholder="담당자명을 입력해주세요"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-bold text-lg shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-[#d4af37] uppercase tracking-[0.2em] pl-1">연락처 (필수)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="010-0000-0000"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all font-bold text-lg shadow-inner"
                                    />
                                </div>
                                <button className="w-full bg-gradient-to-r from-[#d4af37] to-[#f9d423] text-black font-black py-6 rounded-2xl mt-12 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#d4af37]/20 flex items-center justify-center gap-3 text-xl">
                                    상담 신청하기 <MousePointer2 size={24} />
                                </button>
                                <p className="text-xs text-slate-500 text-center font-bold mt-8 tracking-wide">CONFIDENTIAL BUSINESS INQUIRY</p>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Policy Modal */}
            {isPolicyModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setIsPolicyModalOpen(false)}></div>
                    <div className="relative bg-[#061a15] border border-[#d4af37]/30 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-3xl animate-slide-in-up">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setIsPolicyModalOpen(false)} className="text-slate-500 hover:text-[#d4af37] transition-colors p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#d4af37]/30 group">
                                <XMarkIcon className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                        <div className="p-10 md:p-16">
                            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#d4af37]/20">
                                <CheckCircle2 size={32} className="text-[#d4af37]" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-6 leading-tight">{activePolicy.title}</h3>
                            <div className="bg-black/30 p-8 rounded-2xl border border-white/5 max-h-[400px] overflow-y-auto">
                                <pre className="text-slate-400 font-medium leading-relaxed whitespace-pre-wrap break-keep text-sm md:text-base">
                                    {activePolicy.content}
                                </pre>
                            </div>
                            <button
                                onClick={() => setIsPolicyModalOpen(false)}
                                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f9d423] text-black font-black py-5 rounded-2xl mt-10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                확인했습니다
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Collection Detail Modal */}
            {isCollectionModalOpen && activeCollection && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setIsCollectionModalOpen(false)}></div>
                    <div className="relative bg-[#061a15] border border-[#d4af37]/30 w-full max-w-4xl rounded-[40px] overflow-hidden shadow-3xl animate-slide-in-up">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 aspect-[3/4]">
                                <img src={activeCollection.image} className="w-full h-full object-cover" alt={activeCollection.title} />
                            </div>
                            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center gap-8 bg-gradient-to-br from-[#061a15] to-[#0a2e26]">
                                <div className="space-y-4">
                                    <h4 className="text-[#d4af37] font-black uppercase tracking-[0.3em] text-xs">Exquisite Showcase</h4>
                                    <h3 className="text-4xl font-black text-white leading-tight">{activeCollection.title}</h3>
                                </div>
                                <p className="text-slate-400 font-medium leading-relaxed text-lg whitespace-pre-wrap">
                                    {activeCollection.desc}
                                </p>
                                <button className="w-full bg-[#d4af37] text-black font-black py-5 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                    지점별 예약 상담하기
                                </button>
                                <button onClick={() => setIsCollectionModalOpen(false)} className="text-slate-500 font-black hover:text-white transition-colors">닫기</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pillar Detail Modal */}
            {isPillarModalOpen && activePillar && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setIsPillarModalOpen(false)}></div>
                    <div className="relative bg-[#061a15] border border-[#d4af37]/30 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-3xl animate-slide-in-up p-10 md:p-16">
                        <div className="bg-[#d4af37]/10 w-20 h-20 rounded-full flex items-center justify-center mb-10 border border-[#d4af37]/20">
                            <Sparkles size={40} className="text-[#d4af37]" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-4">{activePillar.title}</h3>
                        <p className="text-[#d4af37] font-bold text-xl mb-8">{activePillar.desc}</p>
                        <div className="bg-black/30 p-8 rounded-3xl border border-white/5">
                            <p className="text-slate-300 font-medium leading-relaxed text-lg break-keep">
                                {activePillar.detail}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsPillarModalOpen(false)}
                            className="w-full bg-gradient-to-r from-[#d4af37] to-[#f9d423] text-black font-black py-5 rounded-2xl mt-12 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            창조의 철학 이해하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function XMarkIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
