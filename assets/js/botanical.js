(function(){
  const cv=document.getElementById('botanical-canvas'),cx=cv.getContext('2d');
  let W,H,roots=[],allBranches=[],frame=0;
  let fireflies=[],pulses=[],blossomRegistry=[];
  let registryDirty=true; // only rebuild blossom list when needed
  let mouse={x:-999,y:-999,inside:false};

  const isMobile=()=>window.innerWidth<768;
  const STEM=['rgba(56,217,245,','rgba(76, 197, 225,','rgba(26,117,165,'];
  const BLOS=['rgba(61, 255, 192,','rgba(71,15,222,','rgba(56,220,172,','rgba(36,25,232,'];
  const BLOS_RGB=['61, 255, 192','71,15,222','56,220,172','36,25,232'];
  const PULSE_RGB='160,220,255';

  // Pre-built reusable gradient cache — avoids creating new objects every frame
  // Key: "x,y,r" → gradient. Cleared on resize.
  const gradCache={};
  function radGrad(x,y,r0,r1,stops){
    const g=cx.createRadialGradient(x,y,r0,x,y,r1);
    for(const [t,c] of stops)g.addColorStop(t,c);
    return g;
  }

  function resize(){
    W=cv.width=cv.offsetWidth;
    H=cv.height=cv.offsetHeight;
    roots=[];allBranches=[];fireflies=[];pulses=[];
    blossomRegistry=[];registryDirty=true;
    seed();
  }

  // ── Branch ────────────────────────────────────────────────
  function Branch(x,y,ang,len,depth,si,parent){
    this.x=x;this.y=y;this.ang=ang;this.len=len;this.depth=depth;this.si=si;
    this.parent=parent||null;this.prog=0;this.spd=0.004+Math.random()*0.003;
    this.spawned=false;this.children=[];this.blossoms=[];this.pulseGlow=0;
    this.done=false; // true once prog===1 and spawned, skip update
    const bend=(Math.random()-.5)*0.65;
    this.cpx=x+Math.cos(ang+bend)*len*0.5;
    this.cpy=y+Math.sin(ang+bend)*len*0.5;
    this.ex=x+Math.cos(ang)*len;
    this.ey=y+Math.sin(ang)*len;
    // Pre-compute draw path points (12 steps is plenty)
    this.pts=null;
    allBranches.push(this);
  }

  Branch.prototype.tip=function(t){
    const u=1-t;
    return{x:u*u*this.x+2*u*t*this.cpx+t*t*this.ex,
           y:u*u*this.y+2*u*t*this.cpy+t*t*this.ey};
  };

  // Cache the full path once the branch is done growing
  Branch.prototype.cachePath=function(){
    this.pts=[];
    for(let i=0;i<=12;i++)this.pts.push(this.tip(i/12));
  };

  Branch.prototype.update=function(){
    // Even if this branch is done, children still need updating
    const skipSelf=this.done&&this.pulseGlow<=0&&
      !this.blossoms.some(b=>b.scale<1||b.flash>0);

    if(!skipSelf){
      const wasGrowing=this.prog<1;
      if(this.prog<1)this.prog=Math.min(1,this.prog+this.spd);
      if(wasGrowing&&this.prog>=1&&!this.pts)this.cachePath();

      if(this.prog>0.92&&!this.spawned){
        this.spawned=true;
        const tip=this.tip(1);
        const minLen=Math.min(W,H)*(isMobile()?0.13:0.07);
        if(this.depth>0&&this.len>minLen){
          const nl=this.len*(0.52+Math.random()*0.18),spread=0.32+Math.random()*0.38;
          this.children.push(new Branch(tip.x,tip.y,this.ang-spread,nl,this.depth-1,this.si,this));
          this.children.push(new Branch(tip.x,tip.y,this.ang+spread,nl,this.depth-1,(this.si+1)%STEM.length,this));
          if(Math.random()>0.55)
            this.children.push(new Branch(tip.x,tip.y,this.ang+(Math.random()-.5)*0.2,nl*0.75,this.depth-1,this.si,this));
        } else {
          const count=isMobile()?1:2+Math.floor(Math.random()*2);
          for(let i=0;i<count;i++){
            this.blossoms.push({
              x:tip.x+(Math.random()-.5)*18,y:tip.y+(Math.random()-.5)*18,
              r:6+Math.random()*6,petals:4+Math.floor(Math.random()*3),
              ci:Math.floor(Math.random()*BLOS.length),rot:Math.random()*Math.PI,
              scale:0,spd:0.035+Math.random()*0.025,
              phase:Math.random()*Math.PI*2,pulseSpd:0.0012+Math.random()*0.0018,
              charge:0,flash:0,branch:this,inRegistry:false
            });
          }
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

      let allBlossomsDone=true;
      for(const b of this.blossoms){
        if(b.scale<1){
          b.scale=Math.min(1,b.scale+b.spd);
          if(b.scale>=1&&!b.leaf&&!b.inRegistry){
            blossomRegistry.push(b);b.inRegistry=true;
          }
          allBlossomsDone=false;
        }
        if(b.flash>0){b.flash=Math.max(0,b.flash-0.022);allBlossomsDone=false;}
      }

      if(this.prog>=1&&this.spawned&&allBlossomsDone&&this.pulseGlow<=0)
        this.done=true;
    }

    // Always recurse — children must grow regardless of parent state
    for(const c of this.children)c.update();
  };

  Branch.prototype.draw=function(now){
    const bw=1.2+this.depth*0.9,al=0.5+this.depth*0.07,pg=this.pulseGlow;

    // Use cached pts if available, else compute on-the-fly while growing
    cx.beginPath();
    if(this.pts){
      cx.moveTo(this.pts[0].x,this.pts[0].y);
      for(let i=1;i<this.pts.length;i++)cx.lineTo(this.pts[i].x,this.pts[i].y);
    } else {
      cx.moveTo(this.x,this.y);
      for(let i=1;i<=12;i++){const p=this.tip(i/12*this.prog);cx.lineTo(p.x,p.y);}
    }
    cx.strokeStyle=STEM[this.si]+(al+pg*0.35)+')';
    cx.lineWidth=bw+pg*1.5;cx.lineCap='round';cx.stroke();

    // Electric overlay — only when actively pulsing
    if(pg>0.08){
      cx.beginPath();
      if(this.pts){
        cx.moveTo(this.pts[0].x,this.pts[0].y);
        for(let i=1;i<this.pts.length;i++)cx.lineTo(this.pts[i].x,this.pts[i].y);
      } else {
        cx.moveTo(this.x,this.y);
        for(let i=1;i<=12;i++){const p=this.tip(i/12*this.prog);cx.lineTo(p.x,p.y);}
      }
      cx.strokeStyle=`rgba(${PULSE_RGB},${(pg*0.5).toFixed(2)})`;
      cx.lineWidth=(bw+pg*2)*0.5;cx.stroke();
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
        // Skip stroke on leaves — saves a path op
        cx.beginPath();cx.moveTo(0,-b.lh);cx.lineTo(0,b.lh);
        cx.strokeStyle=BLOS[b.ci]+'0.32)';cx.lineWidth=0.5;cx.stroke();
      } else {
        const gi=pulse*0.12+charge*0.55+flash*0.85;
        // Only draw glow gradient if it will be visible
        if(gi>0.06){
          const gr=b.r*(2.2+charge*3.5+flash*4.5+pulse*1.2);
          const col=flash>0.15?PULSE_RGB:charge>0.25?'10,255,255':BLOS_RGB[b.ci];
          const g=cx.createRadialGradient(0,0,b.r*0.3,0,0,gr);
          g.addColorStop(0,`rgba(${col},${Math.min(0.9,gi).toFixed(2)})`);
          g.addColorStop(1,`rgba(${col},0)`);
          cx.beginPath();cx.arc(0,0,gr,0,Math.PI*2);cx.fillStyle=g;cx.fill();
        }
        // Charge ring
        if(charge>0.08){
          cx.beginPath();cx.arc(0,0,b.r*(2.5-charge*1.4),0,Math.PI*2*charge);
          cx.strokeStyle=`rgba(240,210,100,${(charge*0.7).toFixed(2)})`;cx.lineWidth=1;cx.stroke();
        }
        // Petals — use solid fill, skip per-petal path for low-visibility blossoms
        const pa=(0.5+0.35*pulse+charge*0.28+flash*0.38).toFixed(2);
        const petalCol=flash>0.3?`rgba(200,230,255,${pa})`:BLOS[b.ci]+pa+')';
        for(let p=0;p<b.petals;p++){
          const a=(p/b.petals)*Math.PI*2;
          cx.beginPath();
          cx.ellipse(Math.cos(a)*b.r*0.9,Math.sin(a)*b.r*0.9,b.r*0.5,b.r*0.88,a,0,Math.PI*2);
          cx.fillStyle=petalCol;cx.fill();
        }
        // Centre dot
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
    for(const b of blossomRegistry){
      const dx=b.x-mouse.x,dy=b.y-mouse.y;
      // Skip sqrt for distance check — compare squared distance instead
      if(mouse.inside&&dx*dx+dy*dy<70*70){
        b.charge=Math.min(1,b.charge+0.007);
        if(b.charge>=1){b.charge=0;triggerBurst(b);}
      } else b.charge=Math.max(0,b.charge-0.003);
    }
  }

  // ── Pulse propagation ─────────────────────────────────────
  function triggerBurst(blossom){
    blossom.flash=1;
    if(!blossom.branch)return;
    pulses.push({branch:blossom.branch,t:1,dir:-1,brightness:1});
  }

  function updatePulses(){
    for(let i=pulses.length-1;i>=0;i--){
      const p=pulses[i];
      p.branch.pulseGlow=Math.max(p.branch.pulseGlow,p.brightness*0.75);
      p.branch.done=false; // wake branch for redraw
      p.t+=p.dir*0.028;p.brightness=Math.max(0,p.brightness-0.004);
      if(p.brightness<=0){pulses.splice(i,1);continue;}
      if(p.dir===1&&p.t>=1){
        for(const b of p.branch.blossoms)if(!b.leaf)b.flash=1;
        for(const c of p.branch.children)
          pulses.push({branch:c,t:0,dir:1,brightness:p.brightness*0.82});
        pulses.splice(i,1);
      } else if(p.dir===-1&&p.t<=0){
        const par=p.branch.parent;
        if(par){
          pulses.push({branch:par,t:1,dir:-1,brightness:p.brightness*0.88});
          for(const sib of par.children)
            if(sib!==p.branch)pulses.push({branch:sib,t:0,dir:1,brightness:p.brightness*0.82});
        } else {
          for(const sib of roots)
            if(sib!==p.branch)pulses.push({branch:sib,t:0,dir:1,brightness:p.brightness*0.75});
        }
        pulses.splice(i,1);
      }
    }
  }

  function drawPulses(){
    for(const p of pulses){
      const pos=p.branch.tip(Math.max(0,Math.min(1,p.t))),al=p.brightness*0.95;
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
    const pulse=0.65+0.35*(0.5+0.5*Math.sin(now*0.0022)),r=3.2*pulse;
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

  // ── Seed: multiple roots from off-screen top-right ────────
  function seed(){
    const base=Math.min(W,H);
    const depth=isMobile()?4:6;
    const count=isMobile()?4:7;
    for(let i=0;i<count;i++){
      const onTop=isMobile()?true:Math.random()<0.65;
      const len=base*(isMobile()?0.42+Math.random()*0.1:0.32+Math.random()*0.14);
      const ang=onTop
        ?Math.PI*(0.52+Math.random()*0.28)
        :Math.PI*(0.62+Math.random()*0.22);
      let ox,oy;
      if(onTop){ox=W*(0.45+Math.random()*0.7);oy=-(len*0.88);}
      else{ox=W+(len*0.88);oy=isMobile()?H*(Math.random()*0.5):H*(Math.random()*0.55);}
      roots.push(new Branch(ox,oy,ang,len,depth,i%STEM.length,null));
    }
  }

  function sproutNew(){
    const cands=allBranches.filter(b=>b.prog>=1&&b.children.length<3&&b.depth>0);
    if(!cands.length)return;
    const b=cands[Math.floor(Math.random()*cands.length)],tip=b.tip(1);
    b.done=false;
    b.children.push(new Branch(tip.x,tip.y,b.ang+(Math.random()-.5)*1.1,
      b.len*(0.38+Math.random()*0.28),Math.max(0,b.depth-1),(b.si+1)%STEM.length,b));
  }

  // ── Input ─────────────────────────────────────────────────
  cv.style.cursor='none';
  cv.addEventListener('mouseenter',()=>{mouse.inside=true;});
  cv.addEventListener('mouseleave',()=>{mouse.inside=false;mouse.x=-999;mouse.y=-999;});
  cv.addEventListener('mousemove',e=>{
    const r=cv.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.inside=true;
  });

  // Mobile: single tap fires the nearest blossom once, no continuous charging
  cv.addEventListener('touchstart',e=>{
    e.preventDefault();
    const r=cv.getBoundingClientRect();
    const tx=e.touches[0].clientX-r.left;
    const ty=e.touches[0].clientY-r.top;
    // Find closest blossom within 150px
    let best=null,bestD=150*150;
    for(const b of blossomRegistry){
      const dx=b.x-tx,dy=b.y-ty,d=dx*dx+dy*dy;
      if(d<bestD){bestD=d;best=b;}
    }
    if(best)triggerBurst(best);
  },{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();},{passive:false});
  cv.addEventListener('touchend',()=>{mouse.inside=false;});

  // ── Loop ──────────────────────────────────────────────────
  function loop(){
    cx.clearRect(0,0,W,H);
    const now=Date.now();
    for(const r of roots){r.update();r.draw(now);}
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