import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Gift, Heart, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import cake from "@/assets/birthday-cake.png";
import { birthdayConfig, getBirthdayInfo, getCountdown, getUnlockDate } from "@/birthday-config";
import { BirthdayPhotos } from "@/components/birthday-photos";
import { CandleScene, SongScene } from "@/components/birthday-scenes";
import { useBirthdayCelebration } from "@/hooks/use-birthday-celebration";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: `كل سنة وإنتِ بخير يا ${birthdayConfig.name}!` },
    { name: "description", content: `مفاجأة لعيد ميلاد لـ ${birthdayConfig.name}، فيها حب وأمنيات ولحظات حلوة.` },
    { property: "og:title", content: `كل سنة وإنتِ بخير يا ${birthdayConfig.name}!` },
    { property: "og:description", content: "مفاجأة لعيد ميلاد فيها حب وأمنيات ولحظات حلوة." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const chapters = ["الرسالة", "رسائل حب صغيرة", ...(birthdayConfig.photos.length ? ["ذكرياتنا"] : []), "أمنياتكِ", "أغنيتنا", "الشموع", "بكل حبي"];
const notes = ["لأنكِ بتحلّي حتى الأيام العادية.", "لأن قلبكِ كبير وحنون بكل التفاصيل.", "لأن ضحكتكِ بتفرّح قلبي.", "لأن الدنيا أحلى وإنتِ فيها."];
const wishes = ["يا رب تكون هالسنة مليانة شغلات حلوة.", "ضحك أكتر، وهمّ أقل.", "يا رب تلاقي الشجاعة وتحقّقي كل أحلامكِ.", "يا رب يضل الحب حواليكِ بكل لحظة.", "يا رب تفرحي قد ما قلبكِ بيتمنى."];

function Index() {
  const photoOffset = birthdayConfig.photos.length ? 1 : 0;
  const [step, setStep] = useState(-1);
  const [letterOpen, setLetterOpen] = useState(false);
  const [note, setNote] = useState<number | null>(null);
  const [wish, setWish] = useState(-1);
  const { burst, celebrate, looping, opening, openGift, stop } = useBirthdayCelebration(() => setStep(0));
  useEffect(() => { stop(); }, [step, stop]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const info = getBirthdayInfo(now ?? new Date());
  const countdown = now ? getCountdown(info.nextBirthday, now) : null;
  const ageDigits = String(info.turningAge).split("");
  const countdownUnits: Array<[string, number]> = [
    ["أيام", countdown?.days ?? 0],
    ["ساعات", countdown?.hours ?? 0],
    ["دقائق", countdown?.minutes ?? 0],
    ["ثوانٍ", countdown?.seconds ?? 0],
  ];

  function restart() { setStep(-1); setLetterOpen(false); setNote(null); setWish(-1); }

  const unlock = getUnlockDate();
  const [preview, setPreview] = useState(false);
  useEffect(() => { setPreview(new URLSearchParams(window.location.search).has("vorschau")); }, []);
  if (birthdayConfig.comingSoon && now && !preview && now < unlock) {
    const left = getCountdown(unlock, now);
    const lockedUnits: Array<[string, number]> = [["أيام", left.days], ["ساعات", left.hours], ["دقائق", left.minutes], ["ثوانٍ", left.seconds]];
    return (
      <div className="birthday-site coming-soon" dir="rtl" lang="ar">
        <main className="birthday-main">
          <section className="scene welcome">
            <div className="eyebrow">قريب…</div>
            <h1>في مفاجأة حلوة ناطرتكِ</h1>
            <p className="handwritten welcome-script">استني شوي يا {birthdayConfig.name}، في شي حلو عم نجهّزلكِ ياه ♡</p>
            <div className="coming-gift" aria-hidden="true"><Gift size={72} /></div>
            <div className="countdown-wrap" aria-live="polite">
              <div className="countdown-label">باقي للهدية</div>
              <div className="countdown">
                {lockedUnits.map(([label, value]) => (
                  <div key={label} className="countdown-box">
                    <span className="count-num">{String(value).padStart(2, "0")}</span>
                    <span className="count-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="made-with">معمولة بحب <Heart size={11} fill="currentColor" /></p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={`birthday-site chapter-${step}`} dir="rtl" lang="ar">
      {burst !== null && <div className={`confetti ${looping ? "confetti-loop" : ""}`} key={burst} aria-hidden="true">{Array.from({ length: looping ? 240 : 120 }, (_, i) => <i key={i} />)}</div>}
      <header className="site-header">
        <a href="/" className="wordmark" aria-label="العودة إلى البداية"><span className="brand-heart"><Heart size={17} fill="currentColor" /></span>لكِ<span className="wordmark-dot">.</span></a>
        <span className="header-note">حفلة صغيرة، وحب كبير</span>
        <span className="celebrate-control"><Sparkles size={18} aria-hidden="true" /><span>يلا نحتفل</span></span>
      </header>

      <main className="birthday-main">
        <span className="side-note side-left" aria-hidden="true">اليوم كلو إلكِ</span>
        <span className="side-note side-right" aria-hidden="true">شوية فرح إلكِ</span>

        {step === -1 && <section className="welcome scene" key="welcome">
          <div className="date-badge"><CalendarDays size={13} />{info.nextBirthday.toLocaleDateString("ar", { month: "long", day: "numeric" })}</div>
          <h1>كل سنة وإنتِ بخير، <span className="h1-name">{birthdayConfig.name}</span>!</h1>
          <p className="handwritten welcome-script">لأنكِ إنتِ… وكل شي فيكِ حلو</p>
          <ul className="welcome-qualities" aria-label="أشياء جميلة فيكِ"><li>قلبكِ الطيب</li><li>ضحكتكِ الجميلة</li><li>روحكِ الحنونة</li><li>لطفكِ اللي ما بيشبه حدا</li></ul>
          <p className="intro">حضّرنا لكِ هالمفاجأة الصغيرة، بكل حب.</p>
          <div className="cake-stage">
            {ageDigits.map((digit, i) => (
              <span key={i} aria-hidden="true" className={`age-balloon ${ageDigits.length === 1 ? "age-balloon-single" : `age-balloon-${i}`}`}>{digit}</span>
            ))}
            <span className="cake-sparkle sparkle-one">✧</span><img className="cake-image" src={cake} alt="كيكة عيد ميلاد وردية مع ماكرون وخمس شمعات مولّعين" width={1024} height={1024} /><span className="cake-sparkle sparkle-two">✧</span><span className="cake-caption handwritten">أمنية ناطرتكِ</span><span className="caption-arrow">⤴</span>
          </div>
          {info.isToday ? (
            <p className="today-banner handwritten" aria-live="polite">اليوم يومكِ… يلا نحتفل! ✨</p>
          ) : (
            <div className="countdown-wrap" aria-live="polite">
              <div className="countdown-label">عم نعدّ اللحظات ليجي يومكِ</div>
              <div className="countdown">
                {countdownUnits.map(([label, value]) => (
                  <div key={label} className="countdown-box">
                    <span className="count-num">{countdown ? String(value).padStart(2, "0") : "--"}</span>
                    <span className="count-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button variant="birthday" onClick={openGift} disabled={opening} aria-busy={opening}><Gift size={21} />افتحي الهدية<ArrowRight size={19} /></Button>
          <p className="made-with">مفاجأة صغيرة، معمولة بحب <Heart size={11} fill="currentColor" /></p>
        </section>}

        {step === 0 && <section className="scene letter-scene" key="letter">
          <div className="eyebrow">حكي من القلب</div><h1>رسالة إلكِ</h1><p className="handwritten scene-subtitle">في حكي بالقلب لازم ينقال.</p>
          <div className={`envelope ${letterOpen ? "is-open" : ""}`}>
            <div className="letter-paper">{letterOpen ? <><span className="handwritten salutation">لحبيبتي {birthdayConfig.name}،</span><p>اليوم عيد ميلادكِ، بس إنتِ بتستاهلي نفرح فيكِ كل يوم.</p><p>طيبتكِ وضحكتكِ وقلبكِ الحلو بيخلّوا الدنيا أحلى لكل اللي حواليكِ.</p><p>بتمنّى تكون سنتكِ الجديدة مليانة مغامرات حلوة، وراحة لقلبكِ، وألف سبب لتضحكي.</p><span className="handwritten signature">بكل حبي ♡</span></> : <><Heart className="letter-heart" size={34} /><span className="handwritten">كم كلمة… إلكِ وبس.</span></>}</div>
            <div className="envelope-front" /><Button className="wax-seal" variant="round" onClick={() => setLetterOpen(!letterOpen)} aria-label={letterOpen ? "سكّري الرسالة" : "افتحي الرسالة"}>{letterOpen ? <X size={24} /> : <Heart size={25} />}</Button>
          </div>
          {!letterOpen && <Button variant="ghost" className="letter-open" onClick={() => setLetterOpen(true)}>افتحي الظرف <ArrowRight size={16} /></Button>}
        </section>}

        {step === 1 && <section className="scene love-scene" key="love"><div className="eyebrow">التفاصيل الصغيرة</div><h1>شو بحب فيكِ</h1><p className="handwritten scene-subtitle">في أسباب كتير… وهاي كم وحدة منها.</p><div className="love-grid">{notes.map((text, i) => <Button key={text} variant="ghost" className={`love-note love-note-${i} ${note === i ? "revealed" : ""}`} onClick={() => setNote(note === i ? null : i)} aria-label={`افتحي رسالة الحب ${i + 1}`}><span className="note-number">0{i + 1}</span>{note === i ? <span className="note-message">{text}</span> : <><Heart size={42} fill="currentColor" /><span className="handwritten">رسالة حب صغيرة</span></>}</Button>)}</div></section>}

        {step === 2 && photoOffset === 1 && <BirthdayPhotos photos={birthdayConfig.photos} />}

        {step === 2 + photoOffset && <section className="scene wishes-scene" key="wishes"><div className="eyebrow">تمنّي أمنية</div><h1>أمنيات لسنتكِ الجديدة</h1><p className="handwritten scene-subtitle">مرطبان صغير، فيه كل اللي بتمنّاه إلكِ.</p><Button variant="ghost" className="wish-jar" onClick={() => { setWish((value) => (value + 1) % wishes.length); }} aria-label="افتحي أمنية عيد الميلاد"><span className="jar-lid" /><span className="jar-bow">🎀</span><span className="jar-glass">{Array.from({ length: 12 }, (_, i) => <span key={i}>★</span>)}</span><span className="jar-label handwritten">أمنيات إلكِ</span></Button><p className="wish-message handwritten" aria-live="polite">{wish < 0 ? "يا رب كل اللي بتتمنّيه يصير." : wishes[wish]}</p><Button variant="outline" className="wish-button" onClick={() => { setWish((value) => (value + 1) % wishes.length); }}><Sparkles size={17} />أمنية كمان</Button></section>}

        {step === 3 + photoOffset && <SongScene />}
        {step === 4 + photoOffset && <CandleScene onCelebrate={() => celebrate(true)} />}
        {step === 5 + photoOffset && <section className="scene finale-scene" key="finale"><div className="final-cake"><img src={cake} alt="كيكة عيد ميلادكِ" width={1024} height={1024} /></div><div className="eyebrow">لسنة جديدة من حكايتكِ</div><h1>كل سنة وإنتِ بخير، {birthdayConfig.name}!</h1><p className="handwritten finale-script">بكل حبي… اليوم وكل يوم.</p><div className="final-hearts" aria-hidden="true">♡ <span>♥</span> ♡</div><Button variant="birthday" onClick={restart}><RotateCcw size={19} />شوفيها كمان مرة</Button></section>}

        {step >= 0 && <nav className="chapter-nav" aria-label="فصول هدية عيد الميلاد"><Button variant="round" onClick={() => setStep(step - 1)} aria-label="الفصل السابق"><ArrowLeft size={21} /></Button><div className="chapter-progress"><span className="chapter-name">{chapters[step]}</span><div className="chapter-dots">{chapters.map((label, i) => <Button key={label} variant="ghost" className={`chapter-dot ${i === step ? "active" : ""}`} onClick={() => { setStep(i); }} aria-label={`روحي على ${label}`} aria-current={i === step ? "step" : undefined} />)}</div></div><span className="chapter-count">{step + 1}<span> / {chapters.length}</span></span><Button variant="round" className="next-chapter" disabled={step === chapters.length - 1} onClick={() => { setStep(step + 1); }} aria-label="الفصل التالي"><ArrowRight size={21} /></Button></nav>}
      </main>
      <footer className="site-footer"><span>يوم حلو متلكِ</span><Heart size={13} /><span>معمول بحب، إلكِ وبس</span></footer>
    </div>
  );
}
