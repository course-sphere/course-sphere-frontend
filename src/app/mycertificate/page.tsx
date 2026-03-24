'use client';
 
import { useRouter } from 'next/navigation';
import { CERTIFICATES, CATEGORY_COLORS } from '@/app/certificate/certificateData';
 
export default function MyCertificates() {
    const router = useRouter();
 
    const handleView = (id: string) => {
        router.push(`/certificate?id=${id}`);
    };
 
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300&family=Cinzel:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap');
 
                :root {
                    --gold: #c9a84c;
                    --gold-light: #f0d080;
                    --gold-dark: #8a6820;
                    --bg: #0d0b07;
                    --bg-card: #141009;
                    --bg-card-hover: #1c1508;
                    --border: #2a2010;
                    --border-gold: #3a2e14;
                    --text-primary: #f0e6cc;
                    --text-muted: #7a6840;
                    --text-dim: #4a3e28;
                }
 
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
                .page {
                    min-height: 100vh;
                    background: var(--bg);
                    font-family: 'DM Sans', sans-serif;
                    color: var(--text-primary);
                    padding: 0 0 80px;
                }
 
                .hero {
                    position: relative;
                    padding: 72px 48px 56px;
                    border-bottom: 1px solid var(--border);
                    overflow: hidden;
                }
                .hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 60% 80% at 10% 50%, rgba(201,168,76,0.07) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 60% at 90% 20%, rgba(201,168,76,0.04) 0%, transparent 70%);
                    pointer-events: none;
                }
                .hero-inner {
                    position: relative;
                    max-width: 1120px;
                    margin: 0 auto;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                }
                .hero-label {
                    font-family: 'Cinzel', serif;
                    font-size: 10px;
                    letter-spacing: 0.35em;
                    color: var(--gold);
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .hero-label::before {
                    content: '';
                    display: inline-block;
                    width: 24px;
                    height: 1px;
                    background: var(--gold);
                }
                .hero-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(36px, 5vw, 58px);
                    font-weight: 400;
                    line-height: 1.1;
                    color: var(--text-primary);
                }
                .hero-title em { font-style: italic; color: var(--gold); }
                .hero-count { text-align: right; }
                .hero-count-number {
                    font-family: 'Cinzel', serif;
                    font-size: 48px;
                    font-weight: 600;
                    color: var(--gold);
                    line-height: 1;
                }
                .hero-count-label {
                    font-size: 12px;
                    letter-spacing: 0.12em;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-top: 4px;
                }
 
                .stats {
                    max-width: 1120px;
                    margin: 0 auto;
                    padding: 32px 48px;
                    display: flex;
                    gap: 0;
                    border-bottom: 1px solid var(--border);
                }
                .stat-item {
                    flex: 1;
                    padding: 0 32px 0 0;
                    border-right: 1px solid var(--border);
                }
                .stat-item:first-child { padding-left: 0; }
                .stat-item:last-child { border-right: none; padding-right: 0; padding-left: 32px; }
                .stat-value {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 28px;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .stat-label {
                    font-size: 11px;
                    letter-spacing: 0.14em;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-top: 2px;
                }
 
                .grid-wrap {
                    max-width: 1120px;
                    margin: 0 auto;
                    padding: 48px 48px 0;
                }
                .section-title {
                    font-family: 'Cinzel', serif;
                    font-size: 11px;
                    letter-spacing: 0.3em;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 28px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .section-title::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--border);
                }
 
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                }
 
                .card {
                    position: relative;
                    background: var(--bg-card);
                    border: 1px solid var(--border-gold);
                    cursor: pointer;
                    transition: border-color 0.25s, transform 0.25s, background 0.25s;
                    animation: fadeUp 0.5s ease both;
                    overflow: hidden;
                }
                .card:hover {
                    border-color: var(--gold-dark);
                    background: var(--bg-card-hover);
                    transform: translateY(-3px);
                }
                .card:hover .card-arrow { opacity: 1; transform: translate(0, 0); }
                .card:hover .card-glow { opacity: 1; }
 
                .card:nth-child(1) { animation-delay: 0.05s; }
                .card:nth-child(2) { animation-delay: 0.10s; }
                .card:nth-child(3) { animation-delay: 0.15s; }
                .card:nth-child(4) { animation-delay: 0.20s; }
                .card:nth-child(5) { animation-delay: 0.25s; }
                .card:nth-child(6) { animation-delay: 0.30s; }
 
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
 
                .card-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.06), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }
                .card-stripe { height: 2px; width: 100%; }
                .card-body { padding: 24px 28px 20px; }
                .card-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 16px;
                }
                .card-emoji {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    background: rgba(201,168,76,0.07);
                    border: 1px solid var(--border-gold);
                }
                .card-category {
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border: 1px solid currentColor;
                    opacity: 0.8;
                }
                .card-course {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 19px;
                    font-weight: 600;
                    color: var(--text-primary);
                    line-height: 1.35;
                    margin-bottom: 12px;
                    min-height: 52px;
                }
                .card-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    padding-top: 14px;
                    border-top: 1px solid var(--border);
                }
                .card-meta-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: var(--text-muted);
                }
                .card-meta-row svg { flex-shrink: 0; opacity: 0.6; }
                .card-meta-row span { color: var(--text-primary); opacity: 0.75; }
                .card-footer {
                    padding: 14px 28px;
                    border-top: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .card-id {
                    font-size: 10px;
                    letter-spacing: 0.14em;
                    color: var(--text-dim);
                    text-transform: uppercase;
                }
                .card-arrow {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--gold);
                    opacity: 0;
                    transform: translate(-8px, 0);
                    transition: opacity 0.25s, transform 0.25s;
                }
 
                @media (max-width: 768px) {
                    .hero { padding: 48px 24px 40px; }
                    .stats { padding: 24px; flex-wrap: wrap; gap: 16px; }
                    .stat-item { border-right: none; padding: 0; flex: 0 0 calc(50% - 8px); }
                    .grid-wrap { padding: 32px 24px 0; }
                    .grid { grid-template-columns: 1fr; }
                    .hero-count { display: none; }
                }
            `}</style>
 
            <div className="page">
                <div className="hero">
                    <div className="hero-inner">
                        <div>
                            <div className="hero-label">EduVerse Academy</div>
                            <h1 className="hero-title">
                                Chứng chỉ <em>của tôi</em>
                            </h1>
                        </div>
                        <div className="hero-count">
                            <div className="hero-count-number">{CERTIFICATES.length}</div>
                            <div className="hero-count-label">Chứng chỉ đã đạt</div>
                        </div>
                    </div>
                </div>
 
                <div className="stats">
                    <div className="stat-item">
                        <div className="stat-value">
                            {CERTIFICATES.reduce((sum, c) => sum + c.hours, 0).toLocaleString()}h
                        </div>
                        <div className="stat-label">Tổng giờ học</div>
                    </div>
                    <div className="stat-item" style={{ paddingLeft: 32 }}>
                        <div className="stat-value">
                            {new Set(CERTIFICATES.map((c) => c.category)).size}
                        </div>
                        <div className="stat-label">Lĩnh vực</div>
                    </div>
                    <div className="stat-item" style={{ paddingLeft: 32 }}>
                        <div className="stat-value">2025–2026</div>
                        <div className="stat-label">Thời gian học tập</div>
                    </div>
                </div>
 
                <div className="grid-wrap">
                    <div className="section-title">Tất cả chứng chỉ</div>
                    <div className="grid">
                        {CERTIFICATES.map((cert) => {
                            const color = CATEGORY_COLORS[cert.category] ?? '#c9a84c';
                            return (
                                <div
                                    key={cert.id}
                                    className="card"
                                    onClick={() => handleView(cert.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleView(cert.id)}
                                >
                                    <div className="card-glow" />
                                    <div className="card-stripe" style={{ background: color }} />
                                    <div className="card-body">
                                        <div className="card-top">
                                            <div className="card-emoji">{cert.thumbnail}</div>
                                            <div className="card-category" style={{ color }}>
                                                {cert.category}
                                            </div>
                                        </div>
                                        <div className="card-course">{cert.courseName}</div>
                                        <div className="card-meta">
                                            <div className="card-meta-row">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="12" cy="7" r="4"/>
                                                </svg>
                                                <span>{cert.instructorName}</span>
                                            </div>
                                            <div className="card-meta-row">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <polyline points="12 6 12 12 16 14"/>
                                                </svg>
                                                <span>{cert.hours} giờ học</span>
                                            </div>
                                            <div className="card-meta-row">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                                </svg>
                                                <span>{cert.completionDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="card-id">{cert.id}</div>
                                        <div className="card-arrow">
                                            Xem chứng chỉ
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12"/>
                                                <polyline points="12 5 19 12 12 19"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}