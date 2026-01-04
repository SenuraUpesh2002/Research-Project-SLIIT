import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ModelVisualizations.module.css';

export default function ModelVisualizations() {
  const [files, setFiles] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState({ open: false, file: null });
  const [loadedIframes, setLoadedIframes] = useState({});

  const fetchManifest = async () => {
    try {
      const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/visualizations/manifest.json`);
      if (!res.ok) throw new Error('no manifest');
      const data = await res.json();
      // Support old string manifest or new object manifest
      const normalized = (Array.isArray(data) ? data : []).map(item => {
        if (typeof item === 'string') return { file: item, type: item.toLowerCase().endsWith('.html') ? 'html' : 'image', thumb: null };
        return item;
      });
      setFiles(normalized);
    } catch (err) {
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchManifest();
    const id = setInterval(() => fetchManifest(), 30000); // poll every 30s
    return () => clearInterval(id);
  }, []);

  const refresh = () => fetchManifest();

  if (files === null) return <div className={styles.loading}>Loading visualizations…</div>;
  if (files.length === 0) return <div className={styles.empty}>No visualizations found. Generate visualizations in the `model/visualizations` folder.</div>;

  const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';

  const filtered = files.filter(item => {
    const name = item.file || '';
    if (filter !== 'all') {
      if (!name.toLowerCase().endsWith(filter)) return false;
    }
    if (query && !name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const openModal = (file) => setModal({ open: true, file });
  const closeModal = () => setModal({ open: false, file: null });

  const handleIframeVisible = (entry) => {
    const el = entry.target;
    if (entry.isIntersecting) {
      const key = el.getAttribute('data-key');
      setLoadedIframes(prev => ({ ...prev, [key]: true }));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.leftControls}>
          <h2 className={styles.heading}>Model Visualizations</h2>
          <div className={styles.controls}>
            <input
              aria-label="Search visualizations"
              placeholder="Search files…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className={styles.search}
            />
            <select value={filter} onChange={e => setFilter(e.target.value)} className={styles.select}>
              <option value="all">All</option>
              <option value=".png">PNG</option>
              <option value=".jpg">JPG</option>
              <option value=".svg">SVG</option>
              <option value=".html">HTML</option>
            </select>
          </div>
        </div>
        <div className={styles.rightControls}>
          <button onClick={refresh} className={styles.button}>Refresh</button>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((item, i) => {
          const name = item.file;
          const key = `${i}-${name}`;
          const isHtml = item.type === 'html' || name.toLowerCase().endsWith('.html');
          const thumb = item.thumb ? `${API_BASE}/visualizations/${item.thumb}` : null;
          const url = `${API_BASE}/visualizations/${name}`;

          return (
            <div key={key} className={styles.card} onClick={() => openModal(item)} role="button" tabIndex={0}>
              {isHtml ? (
                <div className={styles.iframeWrap} data-key={key}>
                  {loadedIframes[key] ? (
                    <iframe title={name} src={url} className={styles.iframe} />
                  ) : (
                    <div className={styles.iframePlaceholder} data-key={key}>
                      <span>HTML visualization</span>
                    </div>
                  )}
                </div>
              ) : (
                <img src={thumb || url} alt={name} className={styles.image} loading="lazy" />
              )}
              <div className={styles.caption}>{name}</div>
            </div>
          );
        })}
      </div>

      {modal.open && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>✕</button>
            <div className={styles.modalBody}>
              {modal.file && modal.file.type === 'html' ? (
                <iframe src={`${API_BASE}/visualizations/${modal.file.file}`} className={styles.modalIframe} title={modal.file.file} />
              ) : (
                <img src={`${API_BASE}/visualizations/${modal.file.file}`} alt={modal.file.file} className={styles.modalImage} />
              )}
            </div>
            <div className={styles.modalFooter}>
              <a href={`${API_BASE}/visualizations/${modal.file.file}`} download className={styles.download}>Download</a>
            </div>
          </div>
        </div>
      )}

      {/* Setup simple IntersectionObserver for iframe placeholders */}
      <IframeObserver files={filtered} onVisible={handleIframeVisible} />
    </div>
  );
}

function IframeObserver({ files, onVisible }) {
  // Will attach observers to elements with class iframePlaceholder using a small polling check
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach(onVisible), { rootMargin: '200px' });
    const els = Array.from(document.querySelectorAll('[data-key]'));
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [files, onVisible]);
  return null;
}

IframeObserver.propTypes = {
  files: PropTypes.array.isRequired,
  onVisible: PropTypes.func.isRequired,
};
