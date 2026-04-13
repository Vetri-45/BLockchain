import api from './axios';


export const login = (username, password) =>
  api.post('/login', { username, password });

export const register = (user) =>
  api.post('/user', user);


export const getElections = () => api.get('/elections');
export const getElectionById = (id) => api.get(`/elections/${id}`);
export const createElection = (data) => api.post('/elections', data);
export const updateElection = (id, data) => api.put(`/elections/${id}`, data);
export const deleteElection = (id) => api.delete(`/elections/${id}`);
export const startElection = (id) => api.put(`/start/${id}`);
export const endElection = (id) => api.put(`/end/${id}`);


export const getCandidates = () => api.get('/candidates');
export const getCandidateById = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

export const castVote = (electionId, candidateId) =>
  api.post('/votes/cast', { electionId, candidateId });

export const getResult = (electionId) =>
  api.get(`/votes/result/${electionId}`);

export const verifyBlockchain = () =>
  api.get('/votes/verify');


export const getUsers = () => api.get('/user');
export const deleteUser = (id) => api.delete(`/user/${id}`);
