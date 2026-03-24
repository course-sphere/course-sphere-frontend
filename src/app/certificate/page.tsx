'use client';
 
import { useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCertificateById, CERTIFICATES } from '@/app/certificate/certificateData';
 
export default function CourseCertificate() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const certRef = useRef<HTMLDivElement>(null);
 
    // Lấy id từ URL: /certificate?id=CERT-2026-00847
    // Nếu không có id thì fallback về cert đầu tiên
    const id = searchParams.get('id') ?? '';
    const cert = getCertificateById(id) ?? CERTIFICATES[0];
 
    const handlePrint = () => window.print();
 
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
 
                :root {
                    --gold-light: #f0d080;
                    --gold:       #c9a84c;
                    --gold-dark:  #8a6820;
                    --cream:      #fdf8ee;
                    --deep:       #1a1208;
                    --ink:        #2d2010;
                    --muted:      #7a6340;
                }
 
                * { box-sizing: border-box; margin: 0; padding: 0; }
 
                body {
                    background: #0d0a05;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-family: 'DM Sans', sans-serif;
                    padding: 2rem 1rem;
                }
 
                .page-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    width: 100%;
                    max-width: 960px;
                }
 
                .cert {
                    position: relative;
                    width: 100%;
                    background: var(--cream);
                    padding: 60px 72px;
                    overflow: hidden;
                }
                .cert::before {
                    content: '';
                    position: absolute;
                    inset: 10px;
                    border: 1.5px solid var(--gold);
                    pointer-events: none;
                }
                .cert::after {
                    content: '';
                    position: absolute;
                    inset: 16px;
                    border: 0.5px solid var(--gold-light);
                    pointer-events: none;
                }
 
                .corner {
                    position: absolute;
                    width: 64px;
                    height: 64px;
                    color: var(--gold);
                }
                .corner svg { width: 100%; height: 100%; }
                .corner-tl { top: 8px; left: 8px; }
                .corner-tr { top: 8px; right: 8px; transform: scaleX(-1); }
                .corner-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
                .corner-br { bottom: 8px; right: 8px; transform: scale(-1); }
 
                .watermark {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.04;
                    pointer-events: none;
                    font-family: 'Cinzel', serif;
                    font-size: 120px;
                    font-weight: 700;
                    color: var(--gold-dark);
                    letter-spacing: 0.1em;
                    user-select: none;
                }
 
                .cert-inner {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 0;
                }
 
                .seal-row {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    margin-bottom: 28px;
                }
                .seal-icon { width: 56px; height: 56px; color: var(--gold); }
                .org-name {
                    font-family: 'Cinzel', serif;
                    font-size: 13px;
                    letter-spacing: 0.28em;
                    color: var(--muted);
                    text-transform: uppercase;
                }
 
                .divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    margin: 16px 0;
                }
                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, var(--gold), transparent);
                }
                .divider-diamond {
                    width: 6px;
                    height: 6px;
                    background: var(--gold);
                    transform: rotate(45deg);
                }
 
                .cert-headline {
                    font-family: 'Cinzel', serif;
                    font-size: clamp(22px, 4vw, 34px);
                    font-weight: 600;
                    color: var(--ink);
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    line-height: 1.2;
                    margin: 4px 0 2px;
                }
                .cert-headline-sub {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(13px, 2vw, 15px);
                    font-style: italic;
                    color: var(--muted);
                    letter-spacing: 0.16em;
                    margin-bottom: 28px;
                }
 
                .presented-to {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 15px;
                    font-style: italic;
                    color: var(--muted);
                    letter-spacing: 0.08em;
                    margin-bottom: 8px;
                }
 
                .recipient-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(38px, 7vw, 60px);
                    font-weight: 300;
                    font-style: italic;
                    color: var(--gold-dark);
                    line-height: 1.1;
                    margin-bottom: 24px;
                }
 
                .cert-body {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(14px, 2.2vw, 17px);
                    color: var(--ink);
                    max-width: 580px;
                    line-height: 1.75;
                    margin-bottom: 6px;
                }
                .cert-body strong { font-weight: 600; color: var(--gold-dark); }
 
                .hours-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: 1px solid var(--gold);
                    padding: 4px 16px;
                    margin: 18px 0 28px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: var(--gold-dark);
                }
 
                .sig-row {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-top: 36px;
                    gap: 32px;
                    flex-wrap: wrap;
                }
                .sig-block {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    flex: 1;
                    min-width: 140px;
                }
                .sig-line { width: 160px; height: 1px; background: var(--gold); margin-bottom: 4px; }
                .sig-name {
                    font-family: 'Cinzel', serif;
                    font-size: 11.5px;
                    color: var(--ink);
                    letter-spacing: 0.1em;
                }
                .sig-role {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 12px;
                    font-style: italic;
                    color: var(--muted);
                }
 
                .cert-id {
                    margin-top: 28px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    color: var(--muted);
                    text-transform: uppercase;
                }
 
                .action-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .btn-primary {
                    background: var(--gold);
                    color: var(--deep);
                    border: none;
                    padding: 12px 32px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .btn-primary:hover { background: var(--gold-light); }
                .btn-ghost {
                    background: transparent;
                    color: var(--gold-light);
                    border: 1px solid var(--gold-dark);
                    padding: 12px 32px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: border-color 0.2s, color 0.2s;
                }
                .btn-ghost:hover { border-color: var(--gold-light); color: #fff; }
 
                @media print {
                    body { background: white; padding: 0; }
                    .action-row { display: none; }
                    .cert { box-shadow: none; }
                }
                @media (max-width: 600px) {
                    .cert { padding: 40px 28px; }
                    .sig-row { justify-content: center; }
                }
            `}</style>
 
            <div className="page-wrap">
                <div className="cert" ref={certRef}>
                    {['corner-tl', 'corner-tr', 'corner-bl', 'corner-br'].map((cls) => (
                        <div key={cls} className={`corner ${cls}`}>
                            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4 L4 28 L8 28 L8 8 L28 8 L28 4 Z" fill="currentColor" opacity="0.7"/>
                                <path d="M4 4 L20 4 L20 8 L8 8 L8 20 L4 20 Z" fill="currentColor"/>
                                <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5"/>
                            </svg>
                        </div>
                    ))}
 
                    <div className="watermark">✦</div>
 
                    <div className="cert-inner">
                        <div className="seal-row">
                            <svg className="seal-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="1.5"/>
                                <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3"/>
                                <path d="M28 10 L30.5 20 L40 18 L33 25 L38 34 L28 29 L18 34 L23 25 L16 18 L25.5 20 Z" fill="currentColor" opacity="0.85"/>
                                <text x="28" y="44" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="5" fill="currentColor" letterSpacing="1">CERTIFIED</text>
                            </svg>
                            <div className="org-name">EduVerse Academy</div>
                        </div>
 
                        <div className="divider"><div className="divider-line"/><div className="divider-diamond"/><div className="divider-line"/></div>
                        <div className="cert-headline">Certificate of Completion</div>
                        <div className="cert-headline-sub">of excellence in learning</div>
                        <div className="divider"><div className="divider-line"/><div className="divider-diamond"/><div className="divider-line"/></div>
 
                        <div className="presented-to">Trân trọng trao tặng cho</div>
                        <div className="recipient-name">{cert.recipientName}</div>
 
                        <div className="cert-body">đã xuất sắc hoàn thành toàn bộ chương trình đào tạo</div>
                        <div className="cert-body" style={{ marginTop: 10 }}>
                            <strong>&ldquo;{cert.courseName}&rdquo;</strong>
                        </div>
 
                        <div className="hours-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {cert.hours} giờ học
                        </div>
 
                        <div className="cert-body">
                            Hoàn thành vào ngày <strong>{cert.completionDate}</strong>
                        </div>
 
                        <div className="divider" style={{ marginTop: 8 }}>
                            <div className="divider-line"/><div className="divider-diamond"/><div className="divider-line"/>
                        </div>
 
                        <div className="sig-row">
                            <div className="sig-block">
                                <div className="sig-line"/>
                                <div className="sig-name">{cert.instructorName}</div>
                                <div className="sig-role">Giảng viên phụ trách</div>
                            </div>
                            <div className="sig-block">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="32" cy="32" r="30" fill="#c9a84c" opacity="0.15"/>
                                    <circle cx="32" cy="32" r="26" stroke="#c9a84c" strokeWidth="1"/>
                                    <text x="32" y="30" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7" fill="#8a6820" letterSpacing="0.5">EDU</text>
                                    <text x="32" y="40" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7" fill="#8a6820" letterSpacing="0.5">VERSE</text>
                                </svg>
                            </div>
                            <div className="sig-block">
                                <div className="sig-line"/>
                                <div className="sig-name">Lê Thị Hương</div>
                                <div className="sig-role">Giám đốc đào tạo</div>
                            </div>
                        </div>
 
                        <div className="cert-id">Mã chứng chỉ: {cert.id}</div>
                    </div>
                </div>
 
                <div className="action-row">
                    <button className="btn-primary" onClick={handlePrint}>
                        ↓ Tải xuống / In chứng chỉ
                    </button>
                    <button className="btn-ghost" onClick={() => router.push('/my-certificates')}>
                        ← Về danh sách
                    </button>
                </div>
            </div>
        </>
    );
}