import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dost_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (role) => {
    // ADVANCED: Assign Regions based on Role
    let assignedRegion = '';
    let assignedName = '';

    if (role === 'Super Admin') {
      assignedRegion = 'Central Office'; // Super Admin sees all, but belongs to Central
      assignedName = 'Director Santos';
    } else if (role === 'Admin') {
      assignedRegion = 'Region 1'; // Fixed to Region 1 for this demo
      assignedName = 'Regional Director (R1)';
    } else {
      assignedRegion = 'Region 1'; // Staff also locked to Region 1
      assignedName = 'Encoder (R1)';
    }

    const userData = {
      id: `USER-${Math.floor(Math.random() * 1000)}`,
      name: assignedName,
      role: role,
      region: assignedRegion, // <--- THIS IS THE KEY FIELD
      department: role === 'Super Admin' ? 'IT Head' : 'Operations'
    };
    
    setUser(userData);
    localStorage.setItem('dost_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dost_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);