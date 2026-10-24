import { useState } from "react";
import { Heart } from "lucide-react";
import type { BirthdayPhoto } from "@/birthday-config";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function BirthdayPhotos({ photos }: { photos: BirthdayPhoto[] }) {
  const [selected, setSelected] = useState<BirthdayPhoto | null>(null);
  return <section className="scene photos-scene">
    <div className="eyebrow">لحظات إلنا</div><h1>ذكرياتنا الجميلة</h1>
    <p className="handwritten scene-subtitle">في لحظات بتضل بالقلب علطول.</p>
    <div className="memory-grid">{photos.map((photo, index) => <figure className="memory-photo" key={`${photo.src}-${index}`}>
      <Button variant="ghost" className="memory-open" onClick={() => setSelected(photo)} aria-label={`افتحي الصورة: ${photo.alt}`}>
        <img src={photo.src} alt={photo.alt} loading="lazy" width={600} height={600} />
      </Button>
      <figcaption className="handwritten">{photo.caption || <Heart size={18} aria-hidden="true" />}</figcaption>
    </figure>)}</div>
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent className="memory-dialog" dir="rtl" lang="ar">
        <DialogTitle className="sr-only">{selected?.alt || "ذكرى جميلة"}</DialogTitle>
        {selected && <><img src={selected.src} alt={selected.alt} /><p className="handwritten">{selected.caption}</p></>}
      </DialogContent>
    </Dialog>
  </section>;
}
