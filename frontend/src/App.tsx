import React, { useState, useEffect } from 'react';
import type { User, Category, DataEntry } from './types';
import { authApi, categoryApi, dataEntryApi } from './api';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'entries' | 'categories' | 'profile'>('entries');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [filterMyEntries, setFilterMyEntries] = useState<boolean>(false);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textCatId, setTextCatId] = useState<number | undefined>(undefined);

  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCatId, setFileCatId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadCategories();
      loadEntries();
    }
  }, [currentUser, filterMyEntries]);

  const showMsg = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const loadCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      setCurrentUser(res.data);
    } catch {
      handleLogout();
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err: any) {
      showMsg('Грешка при вчитување категории: ' + (err.response?.data?.message || err.message));
    }
  };

  const loadEntries = async () => {
    try {
      const res = filterMyEntries ? await dataEntryApi.getMy() : await dataEntryApi.getAll();
      setEntries(res.data);
    } catch (err: any) {
      showMsg('Грешка при вчитување записи: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login({ username: authUsername, password: authPassword });
      localStorage.setItem('token', res.data.token);
      showMsg('Успешна најава!');
      await loadCurrentUser();
    } catch (err: any) {
      showMsg('Неуспешна најава: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.register({ username: authUsername, email: authEmail, password: authPassword });
      showMsg('Успешна регистрација!');
      setAuthMode('login');
    } catch (err: any) {
      showMsg('Грешка при регистрација: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setEntries([]);
    setCategories([]);
    showMsg('Одјавени сте.');
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryApi.create({ name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      showMsg('Категоријата е додадена!');
      loadCategories();
    } catch (err: any) {
      showMsg('Грешка при додавање категорија: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Дали сте сигурни дека сакате да ја избришете категоријата?')) return;
    try {
      await categoryApi.delete(id);
      showMsg('Категоријата е избришана.');
      loadCategories();
    } catch (err: any) {
      showMsg('Немате дозвола за бришење на категорија: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddTextEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataEntryApi.addText(textTitle, textContent, textCatId);
      setTextTitle('');
      setTextContent('');
      setTextCatId(undefined);
      showMsg('Текстуалниот запис е успешно додаден!');
      loadEntries();
    } catch (err: any) {
      showMsg('Грешка при додавање на текстуален запис: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddFileEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showMsg('Изберете фајл пред испраќање!');
      return;
    }
    try {
      await dataEntryApi.addFile(fileTitle, selectedFile, fileCatId);
      setFileTitle('');
      setSelectedFile(null);
      setFileCatId(undefined);
      showMsg('Фајлот е успешно прикачен!');
      loadEntries();
    } catch (err: any) {
      showMsg('Грешка при прикачување фајл: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm('Дали сте сигурни дека сакате да го избришете овој запис?')) return;
    try {
      await dataEntryApi.delete(id);
      showMsg('Записот е избришан.');
      loadEntries();
    } catch (err: any) {
      showMsg('Немате право да го избришете овој запис: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!currentUser) {
    return (
        <div className="auth-container">
          <h2>DCHub - {authMode === 'login' ? 'Најава' : 'Регистрација'}</h2>
          {statusMessage && <div className="alert">{statusMessage}</div>}
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
            <div className="form-group">
              <label>Корисничко име:</label>
              <input
                  className="input"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  required
              />
            </div>

            {authMode === 'register' && (
                <div className="form-group">
                  <label>Е-пошта:</label>
                  <input
                      type="email"
                      className="input"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                  />
                </div>
            )}

            <div className="form-group">
              <label>Лозинка:</label>
              <input
                  type="password"
                  className="input"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
              {authMode === 'login' ? 'Најави се' : 'Регистрирај се'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {authMode === 'login' ? (
                <p>
                  Немате сметка?{' '}
                  <button className="btn-link" onClick={() => setAuthMode('register')}>
                    Регистрирајте се тука
                  </button>
                </p>
            ) : (
                <p>
                  Веќе имате сметка?{' '}
                  <button className="btn-link" onClick={() => setAuthMode('login')}>
                    Најавете се тука
                  </button>
                </p>
            )}
          </div>
        </div>
    );
  }

  return (
      <div className="app-container">
        <header className="header">
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>DCHub Портал</h1>
            <small>Најавен корисник: <strong>{currentUser.username}</strong> ({currentUser.role})</small>
          </div>
          <div>
            <button className="btn-secondary" onClick={handleLogout}>Одјави се</button>
          </div>
        </header>

        <nav className="nav">
          <button
              className={`tab-btn ${activeTab === 'entries' ? 'active' : ''}`}
              onClick={() => setActiveTab('entries')}
          >
            Записи (Data Entries)
          </button>
          <button
              className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
          >
            Категории
          </button>
          <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
          >
            Мој Профил
          </button>
        </nav>

        {statusMessage && <div className="alert">{statusMessage}</div>}

        {/* Data Entries */}
        {activeTab === 'entries' && (
            <div>
              <div className="row">
                <div className="card">
                  <h3>Додади Текстуален Запис</h3>
                  <form onSubmit={handleAddTextEntry}>
                    <div className="form-group">
                      <label>Наслов:</label>
                      <input
                          className="input"
                          value={textTitle}
                          onChange={(e) => setTextTitle(e.target.value)}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Содржина:</label>
                      <textarea
                          className="input"
                          style={{ height: 80 }}
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Категорија:</label>
                      <select
                          className="input"
                          value={textCatId ?? ''}
                          onChange={(e) => setTextCatId(e.target.value ? Number(e.target.value) : undefined)}
                      >
                        <option value="">-- Без категорија --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="btn-primary">Зачувај Текст</button>
                  </form>
                </div>

                <div className="card">
                  <h3>Прикачи Фајл (PDF, DOCX, XLSX, CSV, TXT)</h3>
                  <form onSubmit={handleAddFileEntry}>
                    <div className="form-group">
                      <label>Наслов:</label>
                      <input
                          className="input"
                          value={fileTitle}
                          onChange={(e) => setFileTitle(e.target.value)}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Избери фајл:</label>
                      <input
                          type="file"
                          className="input"
                          onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>Категорија:</label>
                      <select
                          className="input"
                          value={fileCatId ?? ''}
                          onChange={(e) => setFileCatId(e.target.value ? Number(e.target.value) : undefined)}
                      >
                        <option value="">-- Без категорија --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="btn-primary">Прикачи Фајл</button>
                  </form>
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>Листа на Записи</h2>
                  <label style={{ cursor: 'pointer', fontWeight: 500 }}>
                    <input
                        type="checkbox"
                        checked={filterMyEntries}
                        onChange={(e) => setFilterMyEntries(e.target.checked)}
                    />{' '}
                    Прикажи само мои записи
                  </label>
                </div>

                {entries.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: '#57606a' }}>
                      Нема достапни записи.
                    </div>
                ) : (
                    <table className="table">
                      <thead>
                      <tr>
                        <th>ID</th>
                        <th>Наслов</th>
                        <th>Тип</th>
                        <th>Содржина / Датотека</th>
                        <th>Категорија</th>
                        <th>Објавил</th>
                        <th>Акции</th>
                      </tr>
                      </thead>
                      <tbody>
                      {entries.map((entry) => {
                        const isOwner = entry.uploadedBy?.username === currentUser.username;
                        const canDelete = isOwner || currentUser.role === 'ADMIN';

                        return (
                            <tr key={entry.id}>
                              <td>{entry.id}</td>
                              <td><strong>{entry.title}</strong></td>
                              <td>{entry.fileName ? 'Фајл' : 'Текст'}</td>
                              <td>
                                {entry.content && <span>{entry.content}</span>}
                                {entry.fileName && (<span>{entry.fileName} ({entry.fileType})</span>)}
                              </td>
                              <td>{entry.category?.name || '-'}</td>
                              <td>{entry.uploadedBy?.username}</td>
                              <td>
                                {canDelete && (
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleDeleteEntry(entry.id)}
                                    >
                                      Избриши
                                    </button>
                                )}
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                    </table>
                )}
              </div>
            </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
            <div>
              {currentUser.role === 'ADMIN' ? (
                  <div className="card" style={{ maxWidth: 500 }}>
                    <h3>Додади Категорија</h3>
                    <form onSubmit={handleAddCategory}>
                      <div className="form-group">
                        <label>Име:</label>
                        <input
                            className="input"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Опис:</label>
                        <input
                            className="input"
                            value={newCatDesc}
                            onChange={(e) => setNewCatDesc(e.target.value)}
                            required
                        />
                      </div>

                      <button type="submit" className="btn-primary">Зачувај Категорија</button>
                    </form>
                  </div>
              ) : (
                  <div className="alert">
                    Само корисници со улога <strong>ADMIN</strong> можат да креираат и бришат категории.
                  </div>
              )}

              <h2>Сите Категории</h2>
              <table className="table">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Име</th>
                  <th>Опис</th>
                  {currentUser.role === 'ADMIN' && <th>Акции</th>}
                </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td><strong>{cat.name}</strong></td>
                      <td>{cat.description}</td>
                      {currentUser.role === 'ADMIN' && (
                          <td>
                            <button
                                className="btn-danger"
                                onClick={() => handleDeleteCategory(cat.id)}
                            >
                              Избриши
                            </button>
                          </td>
                      )}
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
            <div className="card" style={{ maxWidth: 450 }}>
              <h2>Мој Профил</h2>
              <p><strong>Корисничко име:</strong> {currentUser.username}</p>
              <p><strong>Е-пошта:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
            </div>
        )}
      </div>
  );
}