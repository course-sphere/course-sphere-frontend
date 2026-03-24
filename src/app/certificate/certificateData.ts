// ── Shared mock data — dùng chung cho cả 2 trang ────────────────────────────
// Sau này thay bằng API call là xong
 
export interface Certificate {
    id: string;
    recipientName: string;
    courseName: string;
    completionDate: string;
    instructorName: string;
    hours: number;
    category: string;
    thumbnail: string;
}
 
export const CERTIFICATES: Certificate[] = [
    {
        id: 'CERT-2026-00847',
        recipientName: 'Nguyễn Văn An',
        courseName: 'Lập Trình Web Full-Stack với React & Node.js',
        completionDate: '25 tháng 03, 2026',
        instructorName: 'Trần Minh Khoa',
        hours: 120,
        category: 'Web Development',
        thumbnail: '💻',
    },
    {
        id: 'CERT-2026-00612',
        recipientName: 'Nguyễn Văn An',
        courseName: 'UI/UX Design Fundamentals & Figma Mastery',
        completionDate: '10 tháng 02, 2026',
        instructorName: 'Nguyễn Thị Lan',
        hours: 80,
        category: 'Design',
        thumbnail: '🎨',
    },
    {
        id: 'CERT-2025-00391',
        recipientName: 'Nguyễn Văn An',
        courseName: 'Machine Learning cơ bản với Python',
        completionDate: '18 tháng 11, 2025',
        instructorName: 'Phạm Quốc Hùng',
        hours: 150,
        category: 'AI & Data',
        thumbnail: '🤖',
    },
    {
        id: 'CERT-2025-00284',
        recipientName: 'Nguyễn Văn An',
        courseName: 'DevOps & CI/CD với Docker và Kubernetes',
        completionDate: '05 tháng 09, 2025',
        instructorName: 'Lê Văn Bình',
        hours: 90,
        category: 'DevOps',
        thumbnail: '⚙️',
    },
    {
        id: 'CERT-2025-00153',
        recipientName: 'Nguyễn Văn An',
        courseName: 'Kỹ năng Giao tiếp & Thuyết trình Chuyên nghiệp',
        completionDate: '22 tháng 06, 2025',
        instructorName: 'Hoàng Minh Tú',
        hours: 40,
        category: 'Soft Skills',
        thumbnail: '🎤',
    },
    {
        id: 'CERT-2025-00089',
        recipientName: 'Nguyễn Văn An',
        courseName: 'Cloud Architecture trên AWS',
        completionDate: '14 tháng 04, 2025',
        instructorName: 'Vũ Thành Long',
        hours: 110,
        category: 'Cloud',
        thumbnail: '☁️',
    },
];
 
export const CATEGORY_COLORS: Record<string, string> = {
    'Web Development': '#c9a84c',
    'Design': '#b07cc6',
    'AI & Data': '#4caecc',
    'DevOps': '#6cbe8a',
    'Soft Skills': '#e07a5f',
    'Cloud': '#5b8fee',
};
 
export function getCertificateById(id: string): Certificate | undefined {
    return CERTIFICATES.find((c) => c.id === id);
}