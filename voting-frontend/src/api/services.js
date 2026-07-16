import api from './axios';

// ─── AUTH ───────────────────────────────────────
export const login = (username, password) =>
  api.post('/login', { username, password });

export const register = (user) =>
  api.post('/otp/send', user); // ✅ fixed — no direct /user

// ─── ELECTIONS ──────────────────────────────────
export const getElections = () => api.get('/admin/elections');         // ✅ fixed
export const getElectionById = (id) => api.get(`/admin/elections/${id}`); // ✅ fixed
export const createElection = (data) => api.post('/admin/elections', data); // ✅ fixed
export const updateElection = (id, data) => api.put(`/admin/elections/${id}`, data); // ✅ fixed
export const deleteElection = (id) => api.delete(`/admin/elections/${id}`); // ✅ fixed
export const startElection = (id) => api.put(`/admin/start/${id}`);   // ✅ fixed
export const endElection = (id) => api.put(`/admin/end/${id}`);       // ✅ fixed

// ─── CANDIDATES ─────────────────────────────────
export const getCandidates = () => api.get('/candidates');             // ✅ correct
export const getCandidateById = (id) => api.get(`/candidates/${id}`); // ✅ correct
export const createCandidate = (data) => api.post('/candidates', data); // ✅ correct
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data); // ✅ correct
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`); // ✅ correct

// ─── VOTES ──────────────────────────────────────
export const castVote = (electionId, candidateId) =>
  api.post('/votes/cast', { electionId, candidateId }); // ✅ correct

export const getResult = (electionId) =>
  api.get(`/votes/result/${electionId}`);               // ✅ correct

export const verifyBlockchain = () =>
  api.get('/votes/verify');                             // ✅ correct

// ─── USERS (Admin) ──────────────────────────────
export const getUsers = () => api.get('/user');         // ✅ correct
export const deleteUser = (id) => api.delete(`/user/${id}`); // ✅ correct