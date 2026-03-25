'use client';

import { useState } from 'react';
import {
    Award,
    Download,
    Calendar,
    CheckCircle,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Certificate {
    id: string;
    courseId: string;
    courseTitle: string;
    instructorName: string;
    issueDate: string;
    studentName: string;
    score: number;
}

const FAKE_FREE_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

const mockCertificates: Certificate[] = [
    {
        id: 'cert-001-ai',
        courseId: FAKE_FREE_UUID,
        courseTitle: 'Introduction to Generative AI & ChatGPT',
        instructorName: 'Andrew Ng',
        issueDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        studentName: 'Nam Học Sinh',
        score: 100,
    },
];

export default function AchievementsPage() {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    const handleDownload = () => {
        toast.success('Preparing your certificate PDF...');
        setTimeout(() => {
            window.print();
        }, 1000);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    My Achievements
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    View and manage your earned certificates and badges.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockCertificates.map((cert) => (
                    <Card
                        key={cert.id}
                        className="group overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800"
                    >
                        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-950 p-6 text-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                            <Award className="absolute top-4 right-4 h-8 w-8 text-amber-400/80" />
                            <h3 className="relative z-10 font-serif text-xl font-bold text-white drop-shadow-sm">
                                {cert.courseTitle}
                            </h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />{' '}
                                    {cert.issueDate}
                                </span>
                                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle className="h-4 w-4" /> Score:{' '}
                                    {cert.score}%
                                </span>
                            </div>
                            <Button
                                className="w-full rounded-xl"
                                onClick={() => setSelectedCert(cert)}
                            >
                                <ExternalLink className="mr-2 h-4 w-4" /> View
                                Certificate
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* DIALOG CHỨNG CHỈ ĐÃ ĐƯỢC ÉP TỈ LỆ NẰM NGANG */}
            <Dialog
                open={!!selectedCert}
                onOpenChange={(open) => !open && setSelectedCert(null)}
            >
                <DialogContent className="max-w-5xl border-none bg-transparent p-4 shadow-none">
                    <DialogTitle className="sr-only">
                        Certificate View
                    </DialogTitle>

                    {selectedCert && (
                        <div className="relative mx-auto flex aspect-[1.414/1] w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-2xl print:aspect-auto print:h-screen print:w-screen print:p-0">
                            {/* Khung viền chứng chỉ */}
                            <div className="relative flex h-full w-full flex-col items-center justify-center border-[12px] border-double border-slate-200 bg-white p-8 text-center print:border-none">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>

                                <Award className="relative z-10 mx-auto mb-4 h-20 w-20 text-amber-500 drop-shadow-md" />

                                <h3 className="relative z-10 mb-2 text-sm font-bold tracking-[0.25em] text-slate-400 uppercase">
                                    Certificate of Completion
                                </h3>

                                <h1 className="relative z-10 mb-6 font-serif text-5xl font-extrabold text-slate-900 sm:text-6xl">
                                    Course Sphere
                                </h1>

                                <p className="relative z-10 mb-4 text-lg text-slate-600">
                                    This is to proudly certify that
                                </p>

                                <h2 className="relative z-10 mb-6 border-b-2 border-slate-200 px-12 pb-4 font-serif text-5xl text-indigo-700 italic sm:text-6xl">
                                    {selectedCert.studentName}
                                </h2>

                                <p className="relative z-10 mb-2 text-lg text-slate-600">
                                    has successfully completed the comprehensive
                                    online course:
                                </p>
                                <strong className="relative z-10 block px-10 font-serif text-3xl text-slate-900">
                                    {selectedCert.courseTitle}
                                </strong>

                                <div className="relative z-10 mt-auto flex w-full max-w-3xl justify-between px-12 pt-8">
                                    <div className="flex flex-col items-center">
                                        <span className="border-b border-slate-400 px-6 pb-2 text-lg font-medium text-slate-800">
                                            {selectedCert.issueDate}
                                        </span>
                                        <span className="mt-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                                            Date of Issue
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="border-b border-slate-400 px-6 pb-2 font-[signature] text-2xl font-bold text-slate-800">
                                            {selectedCert.instructorName}
                                        </span>
                                        <span className="mt-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                                            Lead Instructor
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end gap-3 print:hidden">
                        <Button
                            variant="outline"
                            className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20"
                            onClick={() => setSelectedCert(null)}
                        >
                            Close
                        </Button>
                        <Button
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                            onClick={handleDownload}
                        >
                            <Download className="mr-2 h-4 w-4" /> Save as PDF
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    body * { visibility: hidden; }
                    [role="dialog"] * { visibility: visible; }
                    [role="dialog"] { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 0; }
                }
            `,
                }}
            />
        </div>
    );
}
