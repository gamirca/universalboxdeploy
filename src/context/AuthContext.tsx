import React, { createContext, useCallback, ReactNode, useState } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  email: string;
}

interface AuthContextData {
  email: string;
  register(credentials: RegisterCredentials): Promise<void>;
  login(credentials: LoginCredentials): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@universal:token');
    const email = localStorage.getItem('@universal:email');

    if (token && email) {
      console.log('LocalStorage inicial:', { token, email });
      return { token, email };
    }

    return {} as AuthState;
  });

  //LOGIN

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    console.log('Login attempt with credentials:', credentials);
    const response = await fetch('/apiusuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('Response from API:', data);

    const { token, email } = data;

    if (response.ok && token) {
      localStorage.setItem('@universal:token', token);
      localStorage.setItem('@universal:email', email);

      console.log('Token and email stored in LocalStorage:', { token, email });

      setData({ token, email });
    } else {
      throw new Error('Credenciais incorretas');
    }
  }, []);

  //REGISTRO
  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    console.log('Register attempt with credentials:', credentials);
    const response = await fetch('/criarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('Response from API:', data);

    const { token, email } = data;

    if (response.ok && token) {
      localStorage.setItem('@universal:token', token);
      localStorage.setItem('@universal:email', email);

      console.log('Token and email stored in LocalStorage:', { token, email });

      setData({ token, email });
    } else {
      throw new Error('Credenciais incorretas');
    }
  }, []);

  //LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('@universal:token');
    localStorage.removeItem('@universal:email');
    console.log('Token and email removed from LocalStorage');
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ email: data.email, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
