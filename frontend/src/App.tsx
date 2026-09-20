import React, { useState, useEffect } from 'react';
import type { User, Category, DataEntry } from './types';
import { authApi, categoryApi, dataEntryApi } from './api';
import './App.css';
import { translations, formatDate, truncateText } from './i18n';
import '@fortawesome/fontawesome-free/css/all.min.css';
import mkFlag from './assets/macedonia-flag.png';
import enFlag from './assets/us_flag.png';

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'pptx'];
const ALLOWED_EXTENSIONS_INFO = ALLOWED_EXTENSIONS.join(", ")
const TITLE_MAX_LENGTH = 35;
const CONTENT_MAX_LENGTH = 70;
const FILENAME_MAX_LENGTH = 30;

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'entries' | 'categories' | 'profile'>('entries');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [lang, setLang] = useState<'mk' | 'en'>('mk');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const t = translations[lang];

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

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number | undefined>(undefined);
  const [selectedEntry, setSelectedEntry] = useState<DataEntry | null>(null);
  const [isEditingInModal, setIsEditingInModal] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterUser, setFilterUser] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'TEXT' | 'FILE'>('ALL');

  const [sortBy, setSortBy] = useState<'id' | 'title' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const token = localStorage.getItem('token');
    if (token) {
      loadCurrentUser();
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleLang = () => {
    setLang(lang === 'mk' ? 'en' : 'mk');
  };

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
      showMsg(t.errLoadCategories + (err.response?.data?.message || err.message));
    }
  };

  const loadEntries = async () => {
    try {
      const res = filterMyEntries ? await dataEntryApi.getMy() : await dataEntryApi.getAll();
      setEntries(res.data);
    } catch (err: any) {
      showMsg(t.errLoadEntries + (err.response?.data?.message || err.message));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login({ username: authUsername, password: authPassword });
      localStorage.setItem('token', res.data.token);
      showMsg(t.msgLoginSuccess);
      await loadCurrentUser();
    } catch (err: any) {
      showMsg(t.errLogin + (err.response?.data?.message || err.message));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.register({ username: authUsername, email: authEmail, password: authPassword });
      showMsg(t.msgRegisterSuccess);
      setAuthMode('login');
    } catch (err: any) {
      showMsg(t.errRegister + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setEntries([]);
    setCategories([]);
    showMsg(t.msgLoggedOut);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryApi.create({ name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      showMsg(t.msgCategoryAdded);
      loadCategories();
    } catch (err: any) {
      showMsg(t.errAddCategory + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm(t.confirmDeleteCat)) return;
    try {
      await categoryApi.delete(id);
      showMsg(t.msgCategoryDeleted);
      loadCategories();
    } catch (err: any) {
      showMsg(t.errDeleteCategory + (err.response?.data?.message || err.message));
    }
  };

  const handleAddTextEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textTitle.trim().length > 255) {
      showMsg(t.errTitleTooLong);
      return;
    }

    try {
      await dataEntryApi.addText(textTitle, textContent, textCatId);
      setTextTitle('');
      setTextContent('');
      setTextCatId(undefined);
      showMsg(t.msgTextEntryAdded);
      loadEntries();
    } catch (err: any) {
      showMsg(t.errAddTextEntry + (err.response?.data?.message || err.message));
    }
  };

  const handleAddFileEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      showMsg(t.msgSelectFileFirst);
      return;
    }

    if (fileTitle.trim().length > 255) {
      showMsg(t.errTitleTooLong);
      return;
    }

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      e.currentTarget.reset();
      setFileTitle('');
      setSelectedFile(null);
      setFileCatId(undefined);
      showMsg(t.errInvalidFileType);
      return;
    }

    try {
      await dataEntryApi.addFile(fileTitle, selectedFile, fileCatId);
      setFileTitle('');
      setSelectedFile(null);
      setFileCatId(undefined);
      showMsg(t.msgFileUploaded);
      loadEntries();
    } catch (err: any) {
      showMsg(t.errUploadFile);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await dataEntryApi.delete(id);
      showMsg(t.msgEntryDeleted);
      loadEntries();
    } catch (err: any) {
      showMsg(t.errDeleteEntry + (err.response?.data?.message || err.message));
    }
  };

  const handlePreviewFile = async (id: number, fileName: string | null) => {
    try {
      const res = await dataEntryApi.getFileBlob(id, false);
      const rawContentType = res.headers['content-type'];
      const contentType = typeof rawContentType === 'string' ? rawContentType : 'application/pdf';
      const blob = new Blob([res.data], { type: contentType });
      const fileUrl = window.URL.createObjectURL(blob);
      const newTab = window.open('', '_blank');
      if (newTab) {
        newTab.document.title = fileName || 'Document';
        newTab.location.href = fileUrl;
      }
    } catch (err: any) {
      showMsg(t.errOpenFile + (err.response?.data?.message || err.message));
    }
  };

  const handleDownloadFile = async (id: number, fileName: string | null) => {
    try {
      const res = await dataEntryApi.getFileBlob(id, true);
      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', fileName || 'downloaded-file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (err: any) {
      showMsg(t.errDownloadFile + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedEntry) return;
    try {
      const res = await dataEntryApi.update(selectedEntry.id, {
        title: editTitle,
        content: selectedEntry.content !== null ? editContent : undefined,
        categoryId: editCategoryId,
      });
      showMsg(t.msgEntryUpdated);
      setSelectedEntry(res.data);
      setIsEditingInModal(false);
      loadEntries();
    } catch (err: any) {
      showMsg(t.errEditEntry + (err.response?.data?.message || err.message));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
    }
  };

  const processedEntries = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let result = entries.filter((entry) => {
      const matchesSearch =
          !q ||
          entry.title.toLowerCase().includes(q) ||
          (entry.content && entry.content.toLowerCase().includes(q)) ||
          (entry.fileName && entry.fileName.toLowerCase().includes(q)) ||
          (entry.uploadedBy?.username && entry.uploadedBy.username.toLowerCase().includes(q)) ||
          (entry.category?.name && entry.category.name.toLowerCase().includes(q));

      const matchesCategory =
          filterCategory === 'ALL' ||
          (entry.category && entry.category.id.toString() === filterCategory) ||
          (filterCategory === 'NONE' && !entry.category);

      const matchesUser =
          filterUser === 'ALL' ||
          entry.uploadedBy?.username === filterUser;

      const matchesType =
          filterType === 'ALL' ||
          (filterType === 'FILE' && entry.fileName) ||
          (filterType === 'TEXT' && !entry.fileName);

      return matchesSearch && matchesCategory && matchesUser && matchesType;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        comparison = dateA - dateB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [entries, searchQuery, filterCategory, filterUser, filterType, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedEntries.length / pageSize) || 1;

  const paginatedEntries = processedEntries.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
  );

  const uniqueAuthors = Array.from(
      new Set(entries.map((e) => e.uploadedBy?.username).filter(Boolean))
  );

  if (!currentUser) {
    return (
        <div className="auth-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>DCHub - {authMode === 'login' ? t.login : t.register}</h2>
            <div style={{ display: 'flex', gap: 6, marginLeft: 10}}>
              <button className="icon-btn" onClick={toggleLang}>
                <img
                    src={lang === 'mk' ? mkFlag : enFlag}
                    alt={lang}
                    style={{
                      width: 20,
                      height: 20,
                      objectFit: 'cover',
                      borderRadius: 2,
                      display: 'inline-block'
                    }}
                />
                {lang.toUpperCase()}</button>
              <button className="icon-btn" style={{padding: "15.5px"}} onClick={toggleTheme}>{theme === 'light' ?
                  (<i className="fa-regular fa-lightbulb fa-2xl" style={{color: "rgb(0, 0, 0)"}}></i>) :
                  (<i className="fa-solid fa-lightbulb fa-xl" style={{ color: "rgb(239, 255, 0)" }}></i>) }
              </button>
            </div>
          </div>

          {statusMessage && <div className="alert">{statusMessage}</div>}

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
            <div className="form-group">
              <label>{t.username}:</label>
              <input
                  className="input"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  required
              />
            </div>

            {authMode === 'register' && (
                <div className="form-group">
                  <label>{t.email}:</label>
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
              <label>{t.password}:</label>
              <input
                  type="password"
                  className="input"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
              {authMode === 'login' ? t.login : t.register}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {authMode === 'login' ? (
                <p>
                  {t.noAccount}{' '}
                  <button className="btn-link" onClick={() => setAuthMode('register')}>
                    {t.registerHere}
                  </button>
                </p>
            ) : (
                <p>
                  {t.hasAccount}{' '}
                  <button className="btn-link" onClick={() => setAuthMode('login')}>
                    {t.loginHere}
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
            <h1 style={{ margin: 0, fontSize: 24 }}>{t.portalTitle}</h1>
            <small>{t.loggedInAs}: <strong>{currentUser.username}</strong> ({currentUser.role})</small>
          </div>
          <div className="header-controls">
            <button className="icon-btn" onClick={toggleLang}>
              <img
                  src={lang === 'mk' ? mkFlag : enFlag}
                  alt={lang}
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: 'cover',
                    borderRadius: 2,
                    display: 'inline-block'
                  }}
              />
              {lang.toUpperCase()}
            </button>
            <button className="icon-btn" style={{padding: "15.5px"}} onClick={toggleTheme}>{theme === 'light' ?
                (<i className="fa-regular fa-lightbulb fa-2xl" style={{color: "rgb(0, 0, 0)"}}></i>) :
                (<i className="fa-solid fa-lightbulb fa-xl" style={{ color: "rgb(239, 255, 0)" }}></i>)}
            </button>
            <button className="btn-secondary" onClick={handleLogout}>{t.logout}
                <i className="fa-solid fa-arrow-right-from-bracket"></i></button>
          </div>
        </header>

        <nav className="nav">
          <button
              className={`tab-btn ${activeTab === 'entries' ? 'active' : ''}`}
              onClick={() => setActiveTab('entries')}
          >
            {t.tabEntries}
          </button>
          <button
              className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
          >
            {t.tabCategories}
          </button>
          <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
          >
            {t.tabProfile}
          </button>
        </nav>

        {statusMessage && <div className="toast-alert">{statusMessage}</div>}

        {/* Data Entries */}
        {activeTab === 'entries' && (
            <div>
              <div className="row">
                <div className="card">
                  <h3>{t.addTextTitle}</h3>
                  <form onSubmit={handleAddTextEntry}>
                    <div className="form-group">
                      <label>{t.titleField}:</label>
                      <input
                          className="input"
                          value={textTitle}
                          onChange={(e) => setTextTitle(e.target.value)}
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.contentField}:</label>
                      <textarea
                          className="input"
                          style={{ height: 75 }}
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.categoryField}:</label>
                      <select
                          className="input"
                          value={textCatId ?? ''}
                          onChange={(e) => setTextCatId(e.target.value ? Number(e.target.value) : undefined)}
                      >
                        <option value="">{t.noCategory}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn-primary">{t.saveText}</button>
                  </form>
                </div>

                <div
                    className={`card file-card-dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      handleDrop(e);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const input = document.getElementById('file-input-field') as HTMLInputElement;
                        if (input) {
                          input.files = e.dataTransfer.files;
                        }
                      }
                    }}
                >
                  <h3>{t.addFileTitle}</h3>

                  <form onSubmit={handleAddFileEntry}>
                    <div className="form-group">
                      <label>{t.titleField}:</label>
                      <input
                          className="input"
                          value={fileTitle}
                          onChange={(e) => setFileTitle(e.target.value)}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.chooseFile}: <i className="fa-solid fa-info"
                                                style={{color: "rgb(0, 0, 0)"}}
                                                title={ALLOWED_EXTENSIONS_INFO}
                      ></i>
                      </label>
                      <input
                          id="file-input-field"
                          type="file"
                          className="input"
                          onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                          required={!selectedFile}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.categoryField}:</label>
                      <select
                          className="input"
                          value={fileCatId ?? ''}
                          onChange={(e) => setFileCatId(e.target.value ? Number(e.target.value) : undefined)}
                      >
                        <option value="">{t.noCategory}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="btn-primary">{t.uploadFile}</button>
                  </form>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                {entries.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center' }}>{t.noEntries}</div>
                ) : (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2>{t.entriesList}</h2>
                      </div>

                      {/* Controls */}
                      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                          {/* Search */}
                          <div style={{ flex: '2', minWidth: 200 }}>
                            <input
                                type="text"
                                className="input"
                                placeholder={t.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => {
                                  setSearchQuery(e.target.value);
                                  setCurrentPage(1);
                                }}
                            />
                          </div>

                          {/* Category Filter */}
                          <div style={{ flex: '1', minWidth: 140 }}>
                            <select
                                className="input"
                                value={filterCategory}
                                onChange={(e) => {
                                  setFilterCategory(e.target.value);
                                  setCurrentPage(1);
                                }}
                            >
                              <option value="ALL">{t.allCategories}</option>
                              <option value="NONE">{t.noCategory}</option>
                              {categories.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Author Filter */}
                          <div style={{ flex: '1', minWidth: 140 }}>
                            <select
                                className="input"
                                value={filterUser}
                                onChange={(e) => {
                                  setFilterUser(e.target.value);
                                  setCurrentPage(1);
                                }}
                            >
                              <option value="ALL">{t.allAuthors}</option>
                              {uniqueAuthors.map((username) => (
                                  <option key={username} value={username}>{username}</option>
                              ))}
                            </select>
                          </div>

                          {/* Type Filter */}
                          <div style={{ flex: '1', minWidth: 130 }}>
                            <select
                                className="input"
                                value={filterType}
                                onChange={(e) => {
                                  setFilterType(e.target.value as any);
                                  setCurrentPage(1);
                                }}
                            >
                              <option value="ALL">{t.allTypes}</option>
                              <option value="TEXT">{t.typeText}</option>
                              <option value="FILE">{t.typeFile}</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{t.sortBy}:</span>
                            <select
                                className="input"
                                style={{ width: 'auto', padding: '6px 10px' }}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                              <option value="createdAt">{t.sortCreatedAt}</option>
                              <option value="title">{t.sortTitle}</option>
                              <option value="id">{t.sortId}</option>
                            </select>
                            <button
                                type="button"
                                className="btn-secondary"
                                style={{ padding: '6px 10px' }}
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                              {sortOrder === 'asc' ? (<i className="fa-solid fa-arrow-up-z-a"></i>) :
                                  (<i className="fa-solid fa-arrow-down-z-a"></i>) }
                            </button>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {/*<span style={{ fontSize: 13 }}>{t.itemsPerPage}:</span>*/}
                              <select
                                  className="input"
                                  style={{ width: 'auto', padding: '6px 8px' }}
                                  value={pageSize}
                                  onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                  }}
                              >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                              </select>
                            </div>

                            <label style={{ cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input
                                  type="checkbox"
                                  checked={filterMyEntries}
                                  onChange={(e) => setFilterMyEntries(e.target.checked)}
                              />
                              {t.onlyMyEntries}
                            </label>
                          </div>
                        </div>
                      </div>

                      <table className="table">
                        <thead>
                        <tr>
                          <th>{t.colId}</th>
                          <th>{t.colTitle}</th>
                          <th>{t.colType}</th>
                          <th>{t.colContent}</th>
                          <th>{t.colCategory}</th>
                          <th>{t.colOwner}</th>
                          <th>{t.colCreatedAt}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedEntries.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                                {t.noEntries}
                              </td>
                            </tr>
                        ) : (
                            paginatedEntries.map((entry) => (
                                <tr
                                    key={entry.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      setSelectedEntry(entry);
                                      setIsEditingInModal(false);
                                    }}
                                >
                                  <td>{entry.id}</td>
                                  <td><strong>{truncateText(entry.title, TITLE_MAX_LENGTH)}</strong></td>
                                  <td>{entry.fileName ? t.typeFile : t.typeText}</td>
                                  <td>
                                    {entry.content && <span>{truncateText(entry.content, CONTENT_MAX_LENGTH, true)}</span>}
                                    {entry.fileName && <span>{truncateText(entry.fileName, FILENAME_MAX_LENGTH)}</span>}
                                  </td>
                                  <td>{entry.category?.name || '-'}</td>
                                  <td>{entry.uploadedBy?.username}</td>
                                  <td>{formatDate(entry.createdAt, lang)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                      </table>

                      {totalPages > 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 18 }}>
                            <button
                                className="btn-secondary"
                                style={{padding: '6px 12px'}}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                              <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    className={currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}
                                    style={{ padding: '6px 12px', minWidth: 36 }}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </button>
                            ))}

                            <button
                                className="btn-secondary"
                                style={{padding: '6px 12px'}}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                              <i className="fa-solid fa-chevron-right"></i>
                            </button>
                          </div>
                      )}
                    </div>
                )}
              </div>
            </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
            <div>
              {currentUser.role === 'ADMIN' ? (
                  <div className="card">
                    <h3>{t.addCategory}</h3>
                    <form onSubmit={handleAddCategory}>
                      <div className="form-group">
                        <label>{t.catName}:</label>
                        <input
                            className="input"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            required
                        />
                      </div>
                      <div className="form-group">
                        <label>{t.catDesc}:</label>
                        <input
                            className="input"
                            value={newCatDesc}
                            onChange={(e) => setNewCatDesc(e.target.value)}
                            required
                        />
                      </div>
                      <button type="submit" className="btn-primary">{t.saveCategory}</button>
                    </form>
                  </div>
              ) : (
                  <div className="alert">{t.adminNotice}</div>
              )}

              <h2>{t.categoriesList}</h2>
              <table className="table">
                <thead>
                <tr>
                  <th>{t.colId}</th>
                  <th>{t.catName}</th>
                  <th>{t.catDesc}</th>
                  {currentUser.role === 'ADMIN' && <th>{t.colActions}</th>}
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
                              {t.btnDelete}
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
            <div className="card">
              <h2>{t.tabProfile}</h2>
              <p><strong>{t.username}:</strong> {currentUser.username}</p>
              <p><strong>{t.email}:</strong> {currentUser.email}</p>
              <p><strong>{t.role}:</strong> {currentUser.role}</p>
            </div>
        )}

        {activeTab === 'entries' && selectedEntry && (
            <div className="modal-backdrop" onClick={() => setSelectedEntry(null)}>
              <div className="modal-dialog" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>

                {!isEditingInModal ? (
                    <div>
                      <h3>{selectedEntry.title}</h3>

                      <p><strong>{t.colType}:</strong> {selectedEntry.fileName ? t.typeFile : t.typeText}</p>
                      <p><strong>{t.colCategory}:</strong> {selectedEntry.category?.name || t.noCategory}</p>
                      <p><strong>{t.colCreatedAt}:</strong> {formatDate(selectedEntry.createdAt, lang)}</p>

                      {/* Text content */}
                      {selectedEntry.content && (
                          <div style={{ margin: '14px 0', background: 'var(--bg-primary)', padding: 12, borderRadius: 6, maxHeight: 200, overflowY: 'auto' }}>
                            <strong>{t.textContent}:</strong>
                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 6 }}>
                              {selectedEntry.content}
                            </p>
                          </div>
                      )}

                      {/* Preview and Download */}
                      {selectedEntry.fileName && (
                          <div style={{ margin: '14px 0', padding: 10, border: '1px dashed var(--border-color)', borderRadius: 6 }}>
                            <p style={{ margin: '0 0 8px 0' }}><strong>{t.uploadedFile}:</strong> {selectedEntry.fileName}</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                  className="btn-action"
                                  onClick={() => handlePreviewFile(selectedEntry.id, selectedEntry.fileName)}
                              >
                                {t.btnPreview}
                              </button>
                              <button
                                  className="btn-action"
                                  onClick={() => handleDownloadFile(selectedEntry.id, selectedEntry.fileName)}
                              >
                                {t.btnDownload}
                              </button>
                            </div>
                          </div>
                      )}

                      {/* Author details */}
                      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-secondary)' }}>
                        <div className="card">
                          <h2>{t.authorDetailsTitle}</h2>
                          <p><strong>{t.username}:</strong> {selectedEntry.uploadedBy?.username}</p>
                          <p><strong>{t.email}:</strong> {selectedEntry.uploadedBy?.email}</p>
                          <p><strong>{t.role}:</strong> {selectedEntry.uploadedBy?.role}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="modal-actions" style={{ marginTop: 20 }}>
                        {(currentUser?.role === 'ADMIN' || currentUser?.username === selectedEntry.uploadedBy?.username) && (
                            <>
                              <button
                                  className="btn-secondary"
                                  onClick={() => {
                                    setEditTitle(selectedEntry.title);
                                    setEditContent(selectedEntry.content || '');
                                    setEditCategoryId(selectedEntry.category?.id);
                                    setIsEditingInModal(true);
                                  }}
                              >
                                {t.btnEdit}
                              </button>
                              <button
                                  className="btn-danger"
                                  onClick={() => {
                                    handleDeleteEntry(selectedEntry.id);
                                    setSelectedEntry(null);
                                  }}
                              >
                                {t.btnDelete}
                              </button>
                            </>
                        )}
                        <button className="btn-secondary" onClick={() => setSelectedEntry(null)}>
                          {t.btnClose}
                        </button>
                      </div>
                    </div>
                ) : (
                    <div>
                      <h3>{t.editEntryTitle}</h3>
                      <div className="form-group">
                        <label>{t.titleField}</label>
                        <input
                            className="input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                        />
                      </div>
                      {selectedEntry.content !== null && (
                          <div className="form-group">
                            <label>{t.contentField}</label>
                            <textarea
                                className="input"
                                style={{ height: 100 }}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                          </div>
                      )}
                      <div className="form-group">
                        <label>{t.categoryField}</label>
                        <select
                            className="input"
                            value={editCategoryId ?? ''}
                            onChange={(e) => setEditCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                        >
                          <option value="">{t.noCategory}</option>
                          {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button className="btn-primary" onClick={handleSaveEdit}>
                          {t.btnSave}
                        </button>
                        <button className="btn-secondary" onClick={() => setIsEditingInModal(false)}>
                          {t.btnCancel}
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
}