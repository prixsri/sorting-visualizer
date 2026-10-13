// Made with 💜 by Priyanshu Srivastava
export type AnimationStep = [number, number, string];

const animator = (animations: AnimationStep[]): void => {
  const bars = document.querySelectorAll<HTMLElement>('.bar');
  for (let i = 0; i < animations.length; i++) {
    const [bar, height, color] = animations[i];
    const barElement = bars[bar];
    if (barElement) {
      const barStyle = barElement.style;
      setTimeout(() => {
        barStyle.backgroundColor = color;
        barStyle.height = `${height}px`;
      }, i);
    }
  }
};

export default animator;
