<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the birthday gift journey in the index route with local React state, because its chapters are one continuous interactive experience.
- Define birthday visuals and animations in the global design system, and use the shared Button for controls.
- Keep gift transition and celebration state in useBirthdayCelebration with timer cleanup and explicit chapter-change stop, so repeating showers stay scoped to their chapter.
- Load Arabic font families in the root document head and apply typography and RTL adjustments through global styles, so every chapter shares consistent lettering and direction.
- Keep song playback and microphone analysis browser-local in dedicated birthday scenes; release audio and microphone resources when leaving a chapter to avoid background listening.

- Keep personal photo entries in birthdayConfig and show the memories chapter only when entries exist, so an unconfigured gallery never appears in the gift journey.
