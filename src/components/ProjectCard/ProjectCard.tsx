import "./ProjectCard.css";

export type ProjectCardProps = {
  title: string;
  edited: string;
  image: string;
  onOpen: () => void;
};

/** Figma 9182:3470 — recent project preview card. */
export function ProjectCard({ title, edited, image, onOpen }: ProjectCardProps) {
  return (
    <button
      type="button"
      className="project-card"
      onClick={onOpen}
      aria-label={"Open " + title}
    >
      <span className="project-card__thumbnail">
        <img src={image} alt="" />
      </span>
      <span className="project-card__info">
        <span className="project-card__title">{title}</span>
        <span className="project-card__edited">{edited}</span>
      </span>
    </button>
  );
}
