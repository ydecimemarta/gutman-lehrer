// Ficha de proyecto · Gutman + Lehrer
// Lee los datos de la página en <script type="application/json" id="ficha-data"> y la carpeta de fotos en <body data-img>.
{
  const D=JSON.parse(document.getElementById('ficha-data').textContent);
  const IMG=document.body.dataset.img;

  // Portada: palabras escalonadas
  const ttl=document.getElementById('ttl');
  ttl.innerHTML=ttl.textContent.split(' ').map((w,i)=>`<span style="animation-delay:${.35+i*.18}s">${w}</span>`).join(' ');

  // Header, velo de la portada, parallax y botón flotante de WhatsApp
  const hd=document.getElementById('hd'),veil=document.getElementById('veil'),wa=document.getElementById('wa');
  const plenas=[...document.querySelectorAll('.plena img')];
  const contact=document.getElementById('contacto');
  let last=0,ticking=false;
  const frame=()=>{
    const y=scrollY,h=innerHeight;
    veil.style.setProperty('--dim',Math.min(1,y/h).toFixed(3));
    hd.classList.toggle('solid',y>h*.85);
    hd.classList.toggle('hide',y>h*.5&&y>last);
    const cr=contact.getBoundingClientRect();
    wa.classList.toggle('on',y>h*.9&&!(cr.top<h&&cr.bottom>0));
    last=y;
    plenas.forEach(img=>{
      const r=img.parentElement.getBoundingClientRect();
      if(r.bottom<0||r.top>h)return;
      const p=(r.top+r.height/2-h/2)/(h+r.height); // -0.5 … 0.5
      img.style.transform=`translate3d(0,${(p*-14).toFixed(2)}%,0)`;
    });
    ticking=false;
  };
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
  addEventListener('resize',frame);frame();

  // Entrada de bloques al hacer scroll
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  // Luz y materia: carrusel con lupa
  if(document.getElementById('stage')){
  const objs=D.objs||[];
  const stage=document.getElementById('stage'),capline=document.getElementById('capline'),cnt=document.getElementById('cnt');
  stage.innerHTML=objs.map(([f,c],i)=>`<figure data-i="${i}"><img src="${IMG}${f}.webp" width="1280" height="1920" alt="${c}" draggable="false"></figure>`).join('');
  const figs=[...stage.children];
  let cur=1;
  const place=()=>{
    const w=figs[0].offsetWidth,n=figs.length;
    stage.style.height=(w*1.5)+'px';
    figs.forEach((f,i)=>{
      let d=i-cur; if(d>n/2)d-=n; if(d<-n/2)d+=n;
      const a=Math.abs(d), s=a===0?1:.5, gap=24, x=d===0?0:Math.sign(d)*(w+gap+(a-1)*(w*.5+gap));
      f.style.transform=`translateX(calc(-50% + ${x}px)) scale(${s})`;
      f.style.transformOrigin=d===0?'50% 50%':(d<0?'100% 50%':'0 50%');
      f.style.opacity=a>2?0:(a===0?1:.55);
      f.style.zIndex=10-a;
      f.setAttribute('aria-hidden',a!==0);
    });
    capline.textContent=objs[cur][1];
    cnt.textContent=`${cur+1} / ${n}`;
  };
  const go=i=>{cur=(i+figs.length)%figs.length;place()};
  figs.forEach((f,i)=>f.addEventListener('click',()=>{if(i!==cur)go(i)}));
  document.getElementById('prev').onclick=()=>go(cur-1);
  document.getElementById('nextb').onclick=()=>go(cur+1);
  stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}});
  let sx=null;
  stage.addEventListener('pointerdown',e=>{sx=e.clientX});
  addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1))});
  new ResizeObserver(place).observe(stage);place();
  }

  // Antes / después con varios pares (solo si la ficha lo tiene)
  if(D.pairs&&document.getElementById('cmp')){
  const pairs=D.pairs;
  const tabs=document.getElementById('tabs'),cmp=document.getElementById('cmp'),imgA=document.getElementById('imgA'),imgB=document.getElementById('imgB'),rng=document.getElementById('rng'),hdl=document.getElementById('hdl');
  tabs.innerHTML=pairs.map((p,i)=>`<button class="u" role="tab" data-i="${i}">${p.name}</button>`).join('');
  let pr=pairs[0];
  const size=()=>{const cs=getComputedStyle(cmp.parentElement),maxW=cmp.parentElement.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),maxH=innerHeight*.82;let w=Math.min(maxW,maxH*pr.r);cmp.style.width=w+'px';cmp.style.height=(w/pr.r)+'px'};
  const setPair=i=>{
    pr=pairs[i];
    imgA.src=`${IMG}${pr.a}.webp`;imgA.alt=`${pr.name}, antes de la reforma`;
    imgB.src=`${IMG}${pr.b}.webp`;imgB.alt=`${pr.name}, después de la reforma`;
    [...tabs.children].forEach((t,j)=>t.setAttribute('aria-selected',j===i));
    rng.value=50;slide();size();
  };
  const slide=()=>{imgB.style.clipPath=`inset(0 0 0 ${rng.value}%)`;hdl.style.left=rng.value+'%'};
  rng.addEventListener('input',slide);
  tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(b)setPair(+b.dataset.i)});
  addEventListener('resize',size);setPair(0);
  }

  // Formulario de muestra con validación
  const form=document.getElementById('form');
  form.addEventListener('submit',e=>{
    e.preventDefault();let ok=true;
    form.querySelectorAll('[data-req]').forEach(l=>{const inp=l.querySelector('input');const bad=!inp.checkValidity()||(inp.type!=='checkbox'&&!inp.value.trim());l.classList.toggle('bad',bad);if(bad)ok=false});
    document.getElementById('ok').style.display=ok?'block':'none';
  });

  // Nombre gigante del footer: ocupa todo el ancho
  const gi=document.getElementById('giant');
  const fit=()=>{gi.style.transform='none';gi.style.transform=`scale(${gi.parentElement.clientWidth/gi.offsetWidth})`};
  new ResizeObserver(fit).observe(gi.parentElement);document.fonts&&document.fonts.ready.then(fit);

  // Pruebas: tipografía de títulos y color del footer
  const tf=document.getElementById('font');if(tf){
  tf.addEventListener('change',e=>document.documentElement.style.setProperty('--display',e.target.value+', serif'));
  document.getElementById('foot').addEventListener('change',e=>document.documentElement.style.setProperty('--foot',e.target.value));
  }
}
