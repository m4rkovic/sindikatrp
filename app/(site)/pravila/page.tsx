import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ruleGroups } from '@/lib/data/rules';

export const metadata: Metadata = { title: 'Pravila', description: 'Pravila Sindikat Roleplay servera.' };

export default function RulesPage() {
  return (
    <>
      <PageHero kicker="PRAVILA · VERZIJA 2026" title="Igraj čoveka, ne exploit." text="Pravila postoje da bi scena imala smisla i kad izgubiš. Brojevi klauzula ostaju stabilni da bi prijave i odluke mogle da se pozivaju na isti tekst." />
      <section className="section page-section">
        <div className="shell rules-layout">
          <aside className="rules-nav">
            <span>Sadržaj</span>
            {ruleGroups.map((group) => <a key={group.label} href={`#${group.label[0]}`}>{group.label}</a>)}
          </aside>
          <div className="rules-content">
            {ruleGroups.map((group) => (
              <section className="rule-group" id={group.label[0]} key={group.label}>
                <div className="rule-group__head"><div><span>{group.label}</span><h2>{group.meta}</h2></div><span>{String(group.clauses.length).padStart(2, '0')} klauzula</span></div>
                <div className="rule-list">
                  {group.clauses.map((clause) => (
                    <article className="rule-card" key={clause.no}>
                      <span className="rule-card__no">{clause.no}</span>
                      <div><h3>{clause.title}</h3>{clause.paragraphs.map((p) => <p key={p}>{p}</p>)}{clause.list && <ul>{clause.list.map((item) => <li key={item}>{item}</li>)}</ul>}</div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
