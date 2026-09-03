'use client';

import Image from 'next/image';
import { useState } from 'react';
import { districts } from '@/lib/data/districts';

export function CityShowcase() {
  const [active, setActive] = useState(0);
  const district = districts[active]!;

  return (
    <div className="city-showcase">
      <div className="city-showcase__media">
        {districts.map((item, index) => (
          <Image key={item.cam} src={item.image} fill sizes="100vw" alt={index === active ? item.alt : ''} className={`city-showcase__image ${index === active ? 'is-active' : ''}`} priority={index === 0} />
        ))}
        <div className="city-showcase__veil" />
        <div className="city-showcase__caption">
          <span>{district.cam}</span>
          <h3>{district.name}</h3>
          <p>{district.desc}</p>
        </div>
      </div>
      <div className="city-tabs" role="tablist" aria-label="Delovi grada">
        {districts.map((item, index) => (
          <button key={item.cam} type="button" className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} role="tab" aria-selected={index === active}>
            <span>{item.cam}</span><b>{item.name}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
