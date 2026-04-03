import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface EventData {
    id: string;
    storeName: string;
    title: string;
    content: string;
    lat: number;
    lng: number;
    image: string;
    type: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    img?: string;
    images?: string[];
    date: string;
    hidden?: boolean;
    author?: string;
    comments?: any[];
}

export interface DesignState {
    themeColor: string;
    bannerImages: string[];
    headerMenus: string[];
    attractionsTitle: string;
    bottomMenus: string[];
    noticeText: string;
    storeName: string;
    snsEnabled: boolean;
    businessName: string;
    address: string;
    category1: string;
    category2: string;
    phone: string;
    openHours: string;
    email: string;
    bizNumber: string;
    ceoName: string;
    introText: string;
    guideText: string;
    domainUrl: string;
    useMobileWeb: boolean;
    fallbackUrl: string;
    pcUrl: string;
    greetingText: string;
    shortcutIcon: string;
    pushSettings: {
        newNotice: boolean;
        newPost: boolean;
        postReply: boolean;
        newReview: boolean;
        newInquiry: boolean;
        newApp: boolean;
    };
    logoImage: string;
    topBgColor: string;
    topBgImage: string;
    topTextColor: string;
    attractions: {
        id: string;
        title: string;
        image: string;
        description?: string;
    }[];
}

interface AppState {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    userLoc: { lat: number, lng: number };
    setUserLoc: (loc: { lat: number, lng: number }) => void;
    design: DesignState;
    updateDesign: (updates: Partial<DesignState>) => void;

    // 게시판 데이터 (스토리 탭 연결)
    stories: Post[];
    addStory: (post: Omit<Post, 'id' | 'date'>) => void;
    deleteStory: (id: string) => void;

    // 사용자 지정 문의 양식(필드) 및 예약 현황
    inquiryFormFields: string[];
    inquiries: any[];
    addInquiry: (data: any) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            favorites: [],
            toggleFavorite: (id) => set((state) => ({
                favorites: state.favorites.includes(id)
                    ? state.favorites.filter((f) => f !== id)
                    : [...state.favorites, id]
            })),
            userLoc: { lat: 37.5665, lng: 126.9780 },
            setUserLoc: (userLoc) => set({ userLoc }),
            design: {
                themeColor: '#10b981',
                bannerImages: ['/assets/images/nail_banner.png'],
                headerMenus: ['홈 화면', '스토리', '문의 및 예약', '매장 위치'],
                attractionsTitle: '이달의 추천 아트',
                bottomMenus: ['홈', '검색', '채팅', '마이'],
                noticeText: '[공지] 4월 한정 이벤트! 첫 방문 시 20% 할인 혜택을 드립니다.',
                storeName: '네일블리스',
                snsEnabled: true,
                businessName: '네일블리스',
                address: '서울시 강남구 테헤란로 123 네일타워 2층',
                category1: '네일 아트',
                category2: '뷰티 케어',
                phone: '02-1234-5678',
                openHours: '평일 10:00 ~ 21:00 / 토요일 10:00 ~ 18:00 (일요일 휴무)',
                email: 'contact@nailbliss.com',
                bizNumber: '123-45-67890',
                ceoName: '이네일',
                introText: '프리미엄 네일 아트를 경험해보세요.',
                guideText: '매장 방문 전 예약 부탁드립니다.',
                domainUrl: 'https://nailbliss.com',
                useMobileWeb: true,
                fallbackUrl: '',
                pcUrl: 'https://nailbliss.com',
                greetingText: '오늘 가장 빛나는 손끝, 네일블리스에서 완성해 드릴게요.',
                shortcutIcon: '',
                pushSettings: {
                    newNotice: true,
                    newPost: true,
                    postReply: true,
                    newReview: true,
                    newInquiry: true,
                    newApp: true,
                },
                logoImage: '/assets/images/nail_art_logo_gold.png',
                topBgColor: '#fdf2f2',
                topBgImage: '',
                topTextColor: '#1f2937',
                attractions: [
                    { id: '1', title: '시그니처 체리 네일', image: '/assets/images/nail_art_story_1.png' },
                    { id: '2', title: '영롱한 오로라 네일', image: '/assets/images/nail_art_story_2.png' },
                    { id: '3', title: '미니멀 스파클 네일', image: '/assets/images/nail_art_recommend_3.png' },
                    { id: '4', title: '골드 에메랄드 네일', image: '/assets/images/nail_art_recommend_4.png' }
                ]
            },
            updateDesign: (updates) => set((state) => ({ design: { ...state.design, ...updates } })),

            stories: [
                {
                    id: '1',
                    title: '이달의 화이트데이 특선: 체리 블라썸 🍒',
                    content: '봄의 설렘을 담은 체리 블라썸 아트입니다. 사랑스러운 체리 드로잉과 은은한 진주 파츠의 완벽한 조화! 데이트 룩의 완성은 네일에서 시작됩니다.',
                    date: '2024-03-28',
                    img: '/assets/images/nail_art_story_1.png',
                    author: 'NailBliss_Official',
                    hidden: false,
                    comments: []
                },
                {
                    id: '2',
                    title: '영롱한 보석의 광채: 오로라 아이스 네일 ❄️',
                    content: '빛의 각도에 따라 오묘하게 변하는 신비로운 오로라 광채입니다. 얼음 조각처럼 투명하고 맑은 느낌으로 손끝을 화사하게 밝혀보세요.',
                    date: '2024-03-29',
                    img: '/assets/images/nail_art_story_2.png',
                    author: 'Senior_Designer_J',
                    hidden: false,
                    comments: []
                },
                {
                    id: '3',
                    title: '클래식의 재해석: 실버 글리터 프렌치 ✨',
                    content: '유행을 타지 않는 우아함의 정석, 프렌치 네일에 실버 글리터를 더했습니다. 격식 있는 자리부터 데일리까지 모두 소화 가능한 만능 아트입니다.',
                    date: '2024-03-30',
                    img: '/assets/images/nail_art_story_3.png',
                    author: 'Stylist_Sarah',
                    hidden: false,
                    comments: []
                },
                {
                    id: '4',
                    title: '손끝에 핀 입체 꽃: 엠보 플라워 & 진주 🌸',
                    content: '정교한 핸드페인팅과 3D 엠보 기법으로 살려낸 꽃잎의 디테일! 우아한 진주와 함께 어우러져 한 폭의 그림 같은 분위기를 선사합니다.',
                    date: '2024-04-01',
                    img: '/assets/images/nail_art_story_4.png',
                    author: 'Art_Director_H',
                    hidden: false,
                    comments: []
                },
                {
                    id: '5',
                    title: '심해의 미학: 갤럭시 카키 자석 네일 🌌',
                    content: '자석으로 빚어낸 오묘한 은하수의 흐름. 신비로운 카키와 에메랄드 톤이 어우러져 매혹적인 분위기를 연출하는 전문가용 하이엔드 아트입니다.',
                    date: '2024-04-02',
                    img: '/assets/images/nail_art_story_5.png',
                    author: 'Tech_Master_K',
                    hidden: false,
                    comments: []
                },
                {
                    id: '6',
                    title: '청순함과 화려함 사이: 시럽 그라데이션 & 골드 🍑',
                    content: '은은한 복숭아빛 혈색을 담은 시럽 네일에 고급스러운 골드 리프 포인트를 더했습니다. 내추럴한 아름다움을 추구하시는 분들께 강력 추천합니다.',
                    date: '2024-04-02',
                    img: '/assets/images/nail_art_story_6.png',
                    author: 'Color_Specialist',
                    hidden: false,
                    comments: []
                },
                {
                    id: '7',
                    title: '가장 빛나는 순간: 웨딩 화이트 리본 & 스와로브스키 💍',
                    content: '신부님들이 가장 선호하시는 No.1 베스트셀러! 순백의 화이트 베이스와 앙증맞은 입체 리본, 그리고 정품 스와로브스키의 눈부신 반짝임입니다.',
                    date: '2024-04-02',
                    img: '/assets/images/nail_art_story_7.png',
                    author: 'Bridal_Expert',
                    hidden: false,
                    comments: []
                },
                {
                    id: '8',
                    title: '시크한 도시의 감성: 딥 퍼플 매트 & 실버 라인 💜',
                    content: '벨벳 같은 매트한 질감과 날카로운 실버 라인의 절묘한 조화. 시크하고 세련된 오피스룩이나 파티룩에 완벽한 포인트가 되어줄 아트입니다.',
                    date: '2024-04-02',
                    img: '/assets/images/nail_art_story_8.png',
                    author: 'Fashion_Icons',
                    hidden: false,
                    comments: []
                },
                {
                    id: '9',
                    title: '기분 전환 100%: 테디베어 귀요미 캐릭터 아트 🧸',
                    content: '일상에 힐링을 선사하는 귀여운 테디베어 핸드페인팅! 파스텔톤 컬러감과 조화를 이루어 볼 때마다 행복해지는 마법 같은 아트입니다.',
                    date: '2024-04-02',
                    img: '/assets/images/nail_art_story_9.png',
                    author: 'Cute_Concept_Lab',
                    hidden: false,
                    comments: []
                },
                {
                    id: '10',
                    title: '밤하늘을 옮기다: 은하수 블루 글리터 그라데이션 ☄️',
                    content: '깊은 밤바다와 무한한 우주를 담은 몽환적인 블루 아트. 밤하늘의 별처럼 쏟아지는 글리터 그라데이션으로 신비로운 아우라를 완성하세요.',
                    date: '2024-04-02',
                    img: '/assets/images/nail_art_story_10.png',
                    author: 'Galaxy_Master',
                    hidden: false,
                    comments: []
                }
            ],
            addStory: (post) => set((state) => ({ stories: [{ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], comments: [], hidden: false, ...post }, ...state.stories] })),
            deleteStory: (id) => set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),

            inquiryFormFields: ['연락처', '방문 예정일', '문의 내용'],
            inquiries: [],
            addInquiry: (data) => set((state) => ({ inquiries: [{ id: Date.now().toString(), date: new Date().toISOString(), ...data }, ...state.inquiries] }))
        }),
        {
            name: 'nailbliss-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Cross-tab synchronization
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === 'easytax-storage') {
            useAppStore.persist.rehydrate();
        }
    });
}
