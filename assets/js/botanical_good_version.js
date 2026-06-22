(function(){
  const cv=document.getElementById('botanical-canvas'),cx=cv.getContext('2d');
  let W,H,root=null,allBranches=[],frame=0;
  let fireflies=[],pulses=[],blossomRegistry=[];
  let mouse={x:-999,y:-999,inside:false};

  const isMobile=()=>window.innerWidth<768;
  const STEM=['rgba(80,160,95,','rgba(100,185,110,','rgba(55,100,65,'];
  const BLOS=['rgba(210,175,100,','rgba(220,195,130,','rgba(180,140,80,','rgba(160,200,140,'];
  const BLOS_RGB=['210,175,100','220,195,130','180,140,80','160,200,140'];
  const PULSE_RGB='160,220,255'; // electric blue-white

  function resize(){
    W=cv.width=cv.offsetWidth;
    H=cv.height=cv.offsetHeight;
    root=null;allBranches=[];fireflies=[];pulses=[];blossomRegistry=[];
    seed();
  }

  // ── Branch ────────────────────────────────────────────────
  function Branch(x,y,ang,len,depth,si,parent){
    this.x=x;this.y=y;this.ang=ang;this.len=len;this.depth=depth;this.si=si;
    this.parent=parent||null;
    this.prog=0;this.spd=0.004+Math.random()*0.003;
    this.spawned=false;this.children=[];this.blossoms=[];
    this.pulseGlow=0; // lit by traveling pulse
    const bend=(Math.random()-.5)*0.65;
    this.cpx=x+Math.cos(ang+bend)*len*0.5;
    this.cpy=y+Math.sin(ang+bend)*len*0.5;
    this.ex=x+Math.cos(ang)*len;
    this.ey=y+Math.sin(ang)*len;
    allBranches.push(this);
  }

  Branch.prototype.tip=function(t){
    const u=1-t;
    return{x:u*u*this.x+2*u*t*this.cpx+t*t*this.ex,
           y:u*u*this.y+2*u*t*this.cpy+t*t*this.ey};
  };

  Branch.prototype.update=function(){
    if(this.prog<1)this.prog=Math.min(1,this.prog+this.spd);
    if(this.prog>0.92&&!this.spawned){
      this.spawned=true;
      const tip=this.tip(1);
      const minLen=Math.min(W,H)*0.07;
      if(this.depth>0&&this.len>minLen){
        const nl=this.len*(0.52+Math.random()*0.18),spread=0.32+Math.random()*0.38;
        this.children.push(new Branch(tip.x,tip.y,this.ang-spread,nl,this.depth-1,this.si,this));
        this.children.push(new Branch(tip.x,tip.y,this.ang+spread,nl,this.depth-1,(this.si+1)%STEM.length,this));
        if(Math.random()>0.55)
          this.children.push(new Branch(tip.x,tip.y,this.ang+(Math.random()-.5)*0.2,nl*0.75,this.depth-1,this.si,this));
      } else {
        // Terminal — larger blossoms
        const count=2+Math.floor(Math.random()*2);
        for(let i=0;i<count;i++){
          this.blossoms.push({
            x:tip.x+(Math.random()-.5)*18,y:tip.y+(Math.random()-.5)*18,
            r:6+Math.random()*6,petals:4+Math.floor(Math.random()*3),
            ci:Math.floor(Math.random()*BLOS.length),rot:Math.random()*Math.PI,
            scale:0,spd:0.035+Math.random()*0.025,
            phase:Math.random()*Math.PI*2,pulseSpd:0.0012+Math.random()*0.0018,
            charge:0,  // 0→1 hover charge
            flash:0,   // 0→1 pulse arrival flash
            branch:this
          });
        }
        // One leaf
        const lt=0.35+Math.random()*0.45,lp=this.tip(lt);
        this.blossoms.push({
          x:lp.x,y:lp.y,leaf:true,
          lw:5+Math.random()*4,lh:10+Math.random()*7,
          rot:this.ang+(Math.random()-.5)*0.8,
          ci:Math.floor(Math.random()*BLOS.length),
          scale:0,spd:0.025+Math.random()*0.02,
          phase:Math.random()*Math.PI*2,pulseSpd:0.001+Math.random()*0.0012
        });
      }
    }
    if(this.pulseGlow>0)this.pulseGlow=Math.max(0,this.pulseGlow-0.025);
    for(const b of this.blossoms){
      if(b.scale<1)b.scale=Math.min(1,b.scale+b.spd);
      if(b.flash>0)b.flash=Math.max(0,b.flash-0.022);
    }
    for(const c of this.children)c.update();
  };

  Branch.prototype.collect=function(){
    for(const b of this.blossoms)if(b.scale>=1&&!b.leaf)blossomRegistry.push(b);
    for(const c of this.children)c.collect();
  };

  Branch.prototype.draw=function(now){
    const baseW=1.2+this.depth*0.9,al=0.5+this.depth*0.07,pg=this.pulseGlow;
    // Branch stem
    cx.beginPath();cx.moveTo(this.x,this.y);
    for(let i=1;i<=20;i++){const p=this.tip(i/20*this.prog);cx.lineTo(p.x,p.y);}
    cx.strokeStyle=STEM[this.si]+(al+pg*0.35)+')';
    cx.lineWidth=baseW+pg*1.5;cx.lineCap='round';cx.stroke();
    // Electric overlay when pulsing
    if(pg>0.05){
      cx.beginPath();cx.moveTo(this.x,this.y);
      for(let i=1;i<=20;i++){const p=this.tip(i/20*this.prog);cx.lineTo(p.x,p.y);}
      cx.strokeStyle=`rgba(${PULSE_RGB},${(pg*0.55).toFixed(2)})`;
      cx.lineWidth=(baseW+pg*2)*0.5;cx.stroke();
    }

    for(const b of this.blossoms){
      if(b.scale<=0)continue;
      const pulse=b.scale>=1?0.5+0.5*Math.sin(now*b.pulseSpd+b.phase):0;
      const charge=b.charge||0,flash=b.flash||0;
      cx.save();cx.translate(b.x,b.y);cx.rotate(b.rot);cx.scale(b.scale,b.scale);

      if(b.leaf){
        const la=0.4+0.2*pulse;
        cx.beginPath();cx.ellipse(0,0,b.lw,b.lh,0,0,Math.PI*2);
        cx.fillStyle=BLOS[b.ci]+la+')';cx.fill();
        cx.strokeStyle=BLOS[b.ci]+(la*0.6)+')';cx.lineWidth=0.6;cx.stroke();
        cx.beginPath();cx.moveTo(0,-b.lh);cx.lineTo(0,b.lh);
        cx.strokeStyle=BLOS[b.ci]+'0.35)';cx.lineWidth=0.5;cx.stroke();
      } else {
        // Glow — charge=warm gold, flash=electric blue
        const gi=pulse*0.12+charge*0.55+flash*0.85;
        if(gi>0.02){
          const gr=b.r*(2.2+charge*3.5+flash*4.5+pulse*1.2);
          const g=cx.createRadialGradient(0,0,b.r*0.3,0,0,gr);
          const col=flash>0.15?PULSE_RGB:charge>0.25?'240,210,120':BLOS_RGB[b.ci];
          g.addColorStop(0,`rgba(${col},${Math.min(0.92,gi).toFixed(2)})`);
          g.addColorStop(1,`rgba(${col},0)`);
          cx.beginPath();cx.arc(0,0,gr,0,Math.PI*2);cx.fillStyle=g;cx.fill();
        }
        // Charge ring that closes in on the flower
        if(charge>0.08){
          const ringR=b.r*(2.5-charge*1.4);
          cx.beginPath();cx.arc(0,0,ringR,0,Math.PI*2*charge);
          cx.strokeStyle=`rgba(240,210,100,${(charge*0.7).toFixed(2)})`;
          cx.lineWidth=1;cx.stroke();
        }
        const pa=(0.5+0.35*pulse+charge*0.28+flash*0.38).toFixed(2);
        for(let p=0;p<b.petals;p++){
          const a=(p/b.petals)*Math.PI*2;
          cx.beginPath();
          cx.ellipse(Math.cos(a)*b.r*0.9,Math.sin(a)*b.r*0.9,b.r*0.5,b.r*0.88,a,0,Math.PI*2);
          cx.fillStyle=flash>0.3?`rgba(200,230,255,${pa})`:BLOS[b.ci]+pa+')';
          cx.fill();
        }
        cx.beginPath();cx.arc(0,0,b.r*0.32,0,Math.PI*2);
        cx.fillStyle=flash>0.3
          ?`rgba(220,240,255,${(0.72+flash*0.25).toFixed(2)})`
          :`rgba(240,220,150,${(0.62+0.3*pulse+charge*0.25).toFixed(2)})`;
        cx.fill();
      }
      cx.restore();
    }
    for(const c of this.children)c.draw(now);
  };

  // ── Charging ──────────────────────────────────────────────
  function updateCharging(){
    const hoverR=70;
    for(const b of blossomRegistry){
      const dx=b.x-mouse.x,dy=b.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(mouse.inside&&dist<hoverR){
        b.charge=Math.min(1,b.charge+0.007);
        if(b.charge>=1){b.charge=0;triggerBurst(b);}
      } else {
        b.charge=Math.max(0,b.charge-0.003);
      }
    }
  }

  // ── Pulse propagation (action potential) ──────────────────
  function triggerBurst(blossom){
    blossom.flash=1;
    if(!blossom.branch)return;
    // Pulse travels from tip toward root first
    pulses.push({branch:blossom.branch,t:1,dir:-1,brightness:1});
  }

  function updatePulses(){
    const spd=0.028;
    for(let i=pulses.length-1;i>=0;i--){
      const p=pulses[i];
      p.branch.pulseGlow=Math.max(p.branch.pulseGlow,p.brightness*0.75);
      p.t+=p.dir*spd;
      p.brightness=Math.max(0,p.brightness-0.004);
      if(p.brightness<=0){pulses.splice(i,1);continue;}

      if(p.dir===1&&p.t>=1){
        // Reached a branch tip — flash blossoms, then go to children
        for(const b of p.branch.blossoms)if(!b.leaf)b.flash=1;
        for(const child of p.branch.children)
          pulses.push({branch:child,t:0,dir:1,brightness:p.brightness*0.82});
        pulses.splice(i,1);
      } else if(p.dir===-1&&p.t<=0){
        // Reached branch root — go up to parent, spread down to siblings
        const par=p.branch.parent;
        if(par){
          pulses.push({branch:par,t:1,dir:-1,brightness:p.brightness*0.88});
          for(const sib of par.children)
            if(sib!==p.branch)
              pulses.push({branch:sib,t:0,dir:1,brightness:p.brightness*0.82});
        }
        pulses.splice(i,1);
      }
    }
  }

  function drawPulses(){
    for(const p of pulses){
      const pos=p.branch.tip(Math.max(0,Math.min(1,p.t)));
      const al=p.brightness*0.95;
      const g=cx.createRadialGradient(pos.x,pos.y,0,pos.x,pos.y,14);
      g.addColorStop(0,`rgba(${PULSE_RGB},${al.toFixed(2)})`);
      g.addColorStop(0.4,`rgba(${PULSE_RGB},${(al*0.4).toFixed(2)})`);
      g.addColorStop(1,`rgba(${PULSE_RGB},0)`);
      cx.beginPath();cx.arc(pos.x,pos.y,14,0,Math.PI*2);cx.fillStyle=g;cx.fill();
      cx.beginPath();cx.arc(pos.x,pos.y,3,0,Math.PI*2);
      cx.fillStyle=`rgba(225,245,255,${al.toFixed(2)})`;cx.fill();
    }
  }

  // ── Cursor firefly ────────────────────────────────────────
  function drawCursorFirefly(now){
    if(!mouse.inside||mouse.x<0)return;
    const pulse=0.65+0.35*(0.5+0.5*Math.sin(now*0.0022));
    const r=3.2*pulse;
    const g=cx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,r*7);
    g.addColorStop(0,`rgba(215,245,170,${(0.72*pulse).toFixed(2)})`);
    g.addColorStop(0.35,`rgba(150,215,110,${(0.28*pulse).toFixed(2)})`);
    g.addColorStop(1,'rgba(90,170,70,0)');
    cx.beginPath();cx.arc(mouse.x,mouse.y,r*7,0,Math.PI*2);cx.fillStyle=g;cx.fill();
    cx.beginPath();cx.arc(mouse.x,mouse.y,r,0,Math.PI*2);
    cx.fillStyle=`rgba(235,255,195,${(0.88*pulse).toFixed(2)})`;cx.fill();
  }

  // ── Ambient fireflies ─────────────────────────────────────
  function spawnFirefly(b){
    const a=Math.random()*Math.PI*2,d=15+Math.random()*50;
    return{x:b.x+Math.cos(a)*d,y:b.y+Math.sin(a)*d,ox:b.x,oy:b.y,ci:b.ci,
      r:2+Math.random()*2.5,wAng:Math.random()*Math.PI*2,spd:0.3+Math.random()*0.4,
      phase:Math.random()*Math.PI*2,pulseSpd:0.0008+Math.random()*0.0015,
      wanderR:50+Math.random()*60,alpha:0,life:'alive'};
  }
  function updateFireflies(){
    const max=isMobile()?2:3;
    if(fireflies.length<max&&blossomRegistry.length>0&&frame%80===0)
      fireflies.push(spawnFirefly(blossomRegistry[Math.floor(Math.random()*blossomRegistry.length)]));
    for(let i=fireflies.length-1;i>=0;i--){
      const f=fireflies[i];
      if(f.alpha<1)f.alpha=Math.min(1,f.alpha+0.015);
      f.wAng+=(Math.random()-.5)*0.12;
      f.x+=Math.cos(f.wAng)*f.spd;f.y+=Math.sin(f.wAng)*f.spd;
      const dx=f.x-f.ox,dy=f.y-f.oy,d=Math.sqrt(dx*dx+dy*dy);
      if(d>f.wanderR){f.x-=(dx/d)*0.6;f.y-=(dy/d)*0.6;}
      if(Math.random()<0.0003)f.life='dying';
      if(f.life==='dying'){f.alpha-=0.01;if(f.alpha<=0)fireflies.splice(i,1);}
    }
  }
  function drawFireflies(now){
    for(const f of fireflies){
      const pulse=0.4+0.6*(0.5+0.5*Math.sin(now*f.pulseSpd+f.phase)),al=f.alpha*pulse;
      const gr=f.r*(3+pulse*2.5);
      const g=cx.createRadialGradient(f.x,f.y,0,f.x,f.y,gr);
      g.addColorStop(0,`rgba(${BLOS_RGB[f.ci]},${(al*0.85).toFixed(2)})`);
      g.addColorStop(1,`rgba(${BLOS_RGB[f.ci]},0)`);
      cx.beginPath();cx.arc(f.x,f.y,gr,0,Math.PI*2);cx.fillStyle=g;cx.fill();
      cx.beginPath();cx.arc(f.x,f.y,f.r*pulse,0,Math.PI*2);
      cx.fillStyle=`rgba(255,248,210,${al.toFixed(2)})`;cx.fill();
    }
  }

  // ── Single root + occasional new sprouts ─────────────────
  function seed(){
    // Use the shorter screen dimension so branches stay on canvas
    const base=Math.min(W,H);
    const len=base*(0.28+Math.random()*0.08);
    const depth=isMobile()?4:5;
    // Root from upper-right area, angle constrained to point down-left into the canvas
    const x=W*(0.55+Math.random()*0.35);
    const y=H*(0.02+Math.random()*0.08);
    const ang=Math.PI*(0.52+Math.random()*0.2); // ~94–130°, always downward-left
    root=new Branch(x,y,ang,len,depth,0,null);
  }

  function sproutNew(){
    const candidates=allBranches.filter(b=>b.prog>=1&&b.children.length<3&&b.depth>0);
    if(!candidates.length)return;
    const b=candidates[Math.floor(Math.random()*candidates.length)];
    const tip=b.tip(1);
    const ang=b.ang+(Math.random()-.5)*1.1;
    const len=b.len*(0.38+Math.random()*0.28);
    b.children.push(new Branch(tip.x,tip.y,ang,len,Math.max(0,b.depth-1),(b.si+1)%STEM.length,b));
  }

  // ── Input ─────────────────────────────────────────────────
  cv.style.cursor='none';
  cv.addEventListener('mouseenter',()=>{mouse.inside=true;});
  cv.addEventListener('mouseleave',()=>{mouse.inside=false;mouse.x=-999;mouse.y=-999;});
  cv.addEventListener('mousemove',e=>{
    const r=cv.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.inside=true;
  });
  cv.addEventListener('touchmove',e=>{
    const r=cv.getBoundingClientRect();
    mouse.x=e.touches[0].clientX-r.left;mouse.y=e.touches[0].clientY-r.top;mouse.inside=true;
  },{passive:true});
  cv.addEventListener('touchend',()=>{mouse.inside=false;});

  // ── Loop ──────────────────────────────────────────────────
  function loop(){
    cx.clearRect(0,0,W,H);
    const now=Date.now();
    blossomRegistry=[];
    if(root){root.update();root.collect();root.draw(now);}
    updateFireflies();drawFireflies(now);
    updatePulses();drawPulses();
    updateCharging();
    drawCursorFirefly(now);
    frame++;
    if(frame%900===0)sproutNew();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize',resize);
  resize();
  loop();
})();