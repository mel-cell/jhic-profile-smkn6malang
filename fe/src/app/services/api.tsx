// API Service for Frontend Integration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Helper function for API calls
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

// Public API functions (no authentication required)

// News/Berita APIs
export const newsAPI = {
  // Get all news
  getAll: async (params?: { limit?: number; offset?: number; kategori?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.kategori) queryParams.append('kategori', params.kategori)

    const query = queryParams.toString()
    const endpoint = `/public/news${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Get news detail by ID
  getById: async (newsId: string) => {
    return apiRequest(`/public/news/${newsId}`)
  },

  // Create news (admin only)
  create: async (data: {
    judul: string
    content: string
    imagePath?: string
    kategori?: string
  }, token: string) => {
    return apiRequest('/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update news (admin only)
  update: async (newsId: string, data: {
    judul?: string
    content?: string
    imagePath?: string
    kategori?: string
  }, token: string) => {
    return apiRequest(`/admin/news/${newsId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Delete news (admin only)
  delete: async (newsId: string, token: string) => {
    return apiRequest(`/admin/news/${newsId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

// Extracurricular/Ekskul APIs
export const extracurricularAPI = {
  // Get all extracurriculars
  getAll: async (params?: { limit?: number; offset?: number; kategori?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.kategori) queryParams.append('kategori', params.kategori)

    const query = queryParams.toString()
    const endpoint = `/public/extracurriculars${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Get extracurricular detail by ID
  getById: async (ekskulId: string) => {
    return apiRequest(`/public/extracurriculars/${ekskulId}`)
  },
}

// Jobs APIs (public access to active jobs)
export const jobsAPI = {
  // Get all active job postings
  getAll: async (params?: { limit?: number; offset?: number; location?: string; title?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.location) queryParams.append('location', params.location)
    if (params?.title) queryParams.append('title', params.title)

    const query = queryParams.toString()
    const endpoint = `/public/jobs${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Get all approved jobs for companies (to view all available jobs)
  getAllApproved: async (token: string) => {
    return apiRequest('/public/jobs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get job detail by ID (public - only approved jobs)
  getById: async (jobId: string) => {
    return apiRequest(`/public/jobs/${jobId}`)
  },

  // Get job detail by ID for companies (authenticated - includes pending jobs)
  getByIdForCompany: async (jobId: string, token: string) => {
    return apiRequest(`/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get similar jobs
  getSimilar: async (jobId: string, limit?: number) => {
    const queryParams = new URLSearchParams()
    if (limit) queryParams.append('limit', limit.toString())

    const query = queryParams.toString()
    const endpoint = `/public/jobs/${jobId}/similar${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Create job posting (for companies)
  create: async (data: {
    jobTitle: string
    description?: string
    requirements?: string
    location?: string
    salaryRange?: string
    employmentType?: string
    applicationDeadline?: string
    notes?: string
  }, token: string) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get my job postings (for companies)
  getMyJobs: async (token: string) => {
    return apiRequest('/jobs/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update job posting
  update: async (jobId: string, data: any, token: string) => {
    return apiRequest(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Delete job posting
  delete: async (jobId: string, token: string) => {
    return apiRequest(`/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get job applications (for company owners)
  getApplications: async (jobId: string, token: string) => {
    return apiRequest(`/jobs/${jobId}/applications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

// Companies APIs (public access)
export const companiesAPI = {
  // Get all companies
  getAll: async (params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const query = queryParams.toString()
    const endpoint = `/companies${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Get company by user ID
  getById: async (userId: string) => {
    return apiRequest(`/companies/${userId}`)
  },

  // Get company profile (for authenticated company)
  getProfile: async (token: string) => {
    return apiRequest('/companies/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update company profile
  updateProfile: async (data: {
    companyName?: string
    industryType?: string
    address?: string
    phoneNumber?: string
    website?: string
    description?: string
    contactPersonName?: string
    contactPersonEmail?: string
    contactPersonPhotoPath?: string
  }, token: string) => {
    return apiRequest('/companies/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Upload company logo
  uploadLogo: async (file: File, token: string) => {
    const formData = new FormData()
    formData.append('logo', file)

    return apiRequest('/companies/logo', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

// Portfolios APIs (public access)
export const portfoliosAPI = {
  // Get public portfolios
  getPublic: async (params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const query = queryParams.toString()
    const endpoint = `/portfolios/public${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Search portfolios
  search: async (query: string, params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    return apiRequest(`/portfolios/search?${queryParams.toString()}`)
  },
}

// Reviews APIs (public access to company reviews)
export const reviewsAPI = {
  // Get reviews for a company
  getByCompany: async (companyId: string, params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const query = queryParams.toString()
    const endpoint = `/reviews/company/${companyId}${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },
}

// Prestasi APIs
export const prestasiAPI = {
  // Get all prestasi
  getAll: async (params?: { limit?: number; offset?: number; kategori?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.kategori) queryParams.append('kategori', params.kategori)

    const query = queryParams.toString()
    const endpoint = `/public/prestasi${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Get prestasi detail by ID
  getById: async (prestasiId: string) => {
    return apiRequest(`/public/prestasi/${prestasiId}`)
  },

  // Create prestasi (admin only)
  create: async (data: {
    title: string
    studentId: string
    competitionLevel: string
    organizer: string
    date: string
    imagePath?: string
  }, token: string) => {
    return apiRequest('/admin/prestasi', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update prestasi (admin only)
  update: async (prestasiId: string, data: {
    title?: string
    studentId?: string
    competitionLevel?: string
    organizer?: string
    date?: string
    imagePath?: string
  }, token: string) => {
    return apiRequest(`/admin/prestasi/${prestasiId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Delete prestasi (admin only)
  delete: async (prestasiId: string, token: string) => {
    return apiRequest(`/admin/prestasi/${prestasiId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

// Ekskul APIs
export const ekskulAPI = {
  // Get all ekskul
  getAll: async (params?: { limit?: number; offset?: number; kategori?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.kategori) queryParams.append('kategori', params.kategori)

    const query = queryParams.toString()
    const endpoint = `/public/ekskul${query ? `?${query}` : ''}`

    return apiRequest(endpoint)
  },

  // Get ekskul detail by ID
  getById: async (ekskulId: string) => {
    return apiRequest(`/public/ekskul/${ekskulId}`)
  },

  // Create ekskul (admin only)
  create: async (data: {
    namaEkskul: string
    deskripsi?: string
    kategori?: string
    status?: string
    userInternal?: string
  }, token: string) => {
    return apiRequest('/admin/ekskul', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update ekskul (admin only)
  update: async (ekskulId: string, data: {
    namaEkskul?: string
    deskripsi?: string
    kategori?: string
    status?: string
    userInternal?: string
  }, token: string) => {
    return apiRequest(`/admin/ekskul/${ekskulId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Delete ekskul (admin only)
  delete: async (ekskulId: string, token: string) => {
    return apiRequest(`/admin/ekskul/${ekskulId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },
}

// Students APIs (for authenticated students)
export const studentsAPI = {
  // Get student profile
  getProfile: async (token: string) => {
    return apiRequest('/students/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update student profile
  updateProfile: async (data: {
    fullName?: string
    nis?: string
    address?: string
    phoneNumber?: string
    major?: string
    description?: string
    profilePhotoPath?: string
    email?: string
    gender?: string
    birthDate?: string
    skills?: string
  }, token: string) => {
    return apiRequest('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Upload profile photo
  uploadProfilePhoto: async (file: File, token: string) => {
    const formData = new FormData()
    formData.append('photo', file)

    return apiRequest('/students/profile/photo', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get student's CVs
  getCvs: async (token: string) => {
    return apiRequest('/students/cvs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get students for companies (with search and filter)
  getStudentsForCompanies: async (token: string, search?: string, major?: string) => {
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (major) queryParams.append('major', major)

    const query = queryParams.toString()
    const endpoint = `/students${query ? `?${query}` : ''}`

    return apiRequest(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Upload CV
  uploadCv: async (file: File, token: string, metadata?: any) => {
    const formData = new FormData()
    formData.append('cv', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }

    return apiRequest('/students/cvs', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Delete CV
  deleteCv: async (cvId: string, token: string) => {
    return apiRequest(`/students/cvs/${cvId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // View/Download CV
  getCvFile: async (fileName: string, token: string, download?: boolean) => {
    const query = download ? '?download=true' : ''
    const url = `${API_BASE_URL}/students/cv/${fileName}${query}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch CV file')
    }
    return response
  },
}

// Authentication APIs
export const authAPI = {
  // Student registration
  registerStudent: async (data: {
    email: string
    password: string
    fullName: string
    nis?: string
    major?: string
    address?: string
    phoneNumber?: string
    description?: string
  }) => {
    return apiRequest('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Company registration
  registerCompany: async (data: {
    email: string
    password: string
    companyName: string
    industryType?: string
    address?: string
    phoneNumber?: string
    website?: string
    description?: string
    contactPersonName?: string
    contactPersonEmail?: string
  }) => {
    return apiRequest('/auth/register/company', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Admin registration (temporary)
  registerAdmin: async (data: {
    email: string
    password: string
    fullName: string
  }) => {
    return apiRequest('/auth/register/admin', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Login for all user types
  login: async (data: {
    email: string
    password: string
  }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Get current user profile (requires auth token)
  getProfile: async (token: string) => {
    return apiRequest('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update password (requires auth token)
  updatePassword: async (data: {
    currentPassword: string
    newPassword: string
  }, token: string) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

// Admin APIs (for authenticated admin users)
export const adminAPI = {
  // User management
  getAllUsers: async (token: string) => {
    return apiRequest('/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  updateUserRole: async (userId: string, role: 'STUDENT' | 'COMPANY' | 'ADMIN', token: string) => {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  deleteUser: async (userId: string, token: string) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Job posting management
  getAllJobPostings: async (token: string) => {
    return apiRequest('/admin/job-postings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  updateJobPostingStatus: async (jobId: string, status: string, token: string) => {
    return apiRequest(`/admin/job-postings/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Application management
  getAllApplications: async (token: string) => {
    return apiRequest('/admin/applications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Direct recruitment management
  getAllDirectRecruitments: async (token: string) => {
    return apiRequest('/admin/direct-recruitments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Activity logs
  getActivityLogs: async (token: string) => {
    return apiRequest('/activity-logs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Settings
  getSettings: async (token: string) => {
    return apiRequest('/settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  updateSettings: async (data: any, token: string) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

// Applications APIs (for students)
export const applicationsAPI = {
  // Apply for a job
  apply: async (jobId: string, data: {
    studentCvId: string
    notes?: string
  }, token: string) => {
    return apiRequest(`/applications/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Get my applications (for students)
  getMyApplications: async (token: string) => {
    return apiRequest('/applications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Update application status (for companies)
  updateStatus: async (applicationId: string, status: string, token: string) => {
    return apiRequest(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  // Delete application (for students)
  delete: async (applicationId: string, token: string) => {
    return apiRequest(`/applications/${applicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

// Health check
export const healthCheck = async () => {
  return apiRequest('/')
}
