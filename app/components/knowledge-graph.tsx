const nodes = [
  { className: 'graph-node verse', label: 'Fâtiha 1:5', meta: 'Ayet', position: 'center' },
  { className: 'graph-node tafsir', label: 'Taberî', meta: 'Tefsir', position: 'top-left' },
  { className: 'graph-node tafsir', label: 'İbn Kesîr', meta: 'Tefsir', position: 'bottom-left' },
  { className: 'graph-node hadith', label: 'Sahîh-i Müslim', meta: 'Hadis', position: 'top-right' },
  { className: 'graph-node concept', label: 'İbadet', meta: 'Kavram', position: 'bottom-right' },
];

export function KnowledgeGraph() {
  return (
    <section className="graph-section" id="iliskiler" aria-labelledby="graph-title">
      <div className="graph-copy">
        <span className="section-kicker">Bilgi haritası</span>
        <h2 id="graph-title">Bir ayetten bütün kaynaklara.</h2>
        <p>
          Ayet, hadis, tefsir, kavram ve şahıs kayıtları arasındaki ilmî bağları
          tek bakışta görün. Her çizgi, doğrulanabilir bir kaynak ilişkisini temsil eder.
        </p>
        <ul>
          <li><span className="legend-dot green" /> Ayet ve sureler</li>
          <li><span className="legend-dot amber" /> Hadis külliyatı</li>
          <li><span className="legend-dot blue" /> Tefsir ve kavramlar</li>
        </ul>
        <a className="graph-link" href="#fatiha">Örnek ayet kaydını incele <span>→</span></a>
      </div>

      <div className="graph-stage" role="img" aria-label="Fâtiha Suresi 5. ayetin tefsir, hadis ve kavramlarla ilişkisi">
        <span className="connector line-one" aria-hidden="true" />
        <span className="connector line-two" aria-hidden="true" />
        <span className="connector line-three" aria-hidden="true" />
        <span className="connector line-four" aria-hidden="true" />
        {nodes.map((node) => (
          <div className={`${node.className} ${node.position}`} key={`${node.meta}-${node.label}`}>
            <small>{node.meta}</small>
            <strong>{node.label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
