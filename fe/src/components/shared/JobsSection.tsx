import React from 'react';
import Link from 'next/link';

interface Job {
    id: string;
    jobTitle: string;
    companyName?: string;
    salaryRange?: string;
    employmentType?: string;
    location?: string;
    createdAt?: string;
}

interface JobsSectionProps {
    jobs: Job[];
    loading: boolean;
}

const JobsSection: React.FC<JobsSectionProps> = ({ jobs, loading }) => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Lowongan Kerja Terbaru</h2>
                    <p className="text-gray-600">Temukan peluang karir impianmu</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">Belum ada lowongan kerja tersedia saat ini.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {jobs.slice(0, 6).map((job, index) => (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm text-gray-700 font-semibold">{job.companyName || 'Perusahaan'}</h3>
                                        <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                    </div>

                                    <h2 className="text-lg font-bold text-gray-800 mb-2">{job.jobTitle}</h2>

                                    <div className="flex flex-wrap gap-1 text-xs font-semibold mb-4">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{job.employmentType || 'Full Time'}</span>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{job.location || 'Malang'}</span>
                                    </div>

                                    <p className="text-sm font-medium text-gray-600 mb-4">Kisaran Gaji: {job.salaryRange || 'N/A'}</p>

                                    <Link href={`/siswa/lowongan/${job.id}`}>
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                                            Detail
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {jobs.length > 6 && (
                            <div className="text-center">
                                <Link href="/siswa/lowongan">
                                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-colors">
                                        Lihat Semua Lowongan
                                    </button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default JobsSection;
