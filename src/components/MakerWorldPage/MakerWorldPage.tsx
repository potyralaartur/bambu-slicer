import { useEffect, useRef, useState } from "react";

import { FigmaIcon } from "../../icons";
import { Button } from "../Button/Button";
import { NewTabSearch } from "../NewTabSearch/NewTabSearch";
import { ProductCard } from "../ProductCard/ProductCard";

import "./MakerWorldPage.css";

const RAW_BASE = import.meta.env.BASE_URL;
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;
const assetUrl = (path: string) => BASE + "/assets/makerworld/" + path;

const CATEGORIES = [
  "All",
  "3D Printer",
  "Art",
  "Education",
  "Fashion",
  "Hobby & DIY",
  "Household",
  "Miniatures",
  "Props & Cosplays",
  "Tools",
  "Toys & Games",
  "Generative 3D Model",
];

type TrendingModel = {
  title: string;
  byline: string;
  searchTerms: string;
  category: string;
  image: string;
  likes: string;
  downloads: string;
};

const TRENDING_MODELS: TrendingModel[] = [
  {
    title: "Hiking Utilities · Preview 1",
    byline: "by Scarlett",
    searchTerms: "Scarlett hygrometer outdoor housing",
    category: "Hobby & DIY",
    image: "banner-hiking.png",
    likes: "12.4k",
    downloads: "38.7k",
  },
  {
    title: "Hiking Utilities · Preview 2",
    byline: "by Scarlett",
    searchTerms: "Scarlett hike mate duopod",
    category: "Hobby & DIY",
    image: "hike-mate-duopod.png",
    likes: "8.9k",
    downloads: "24.3k",
  },
  {
    title: "Hiking Utilities · Preview 3",
    byline: "by Scarlett",
    searchTerms: "Scarlett hike king kit box",
    category: "Hobby & DIY",
    image: "hike-king-box.png",
    likes: "15.7k",
    downloads: "41.2k",
  },
  {
    title: "Pocket Double Carabiner – Durable & Lightweight",
    byline: "MakerWorld",
    searchTerms: "MakerWorld carabiner",
    category: "Tools",
    image: "double-carabiner.png",
    likes: "6.3k",
    downloads: "19.8k",
  },
  {
    title: "LEGOs Star Wars - Micro Star Destroyer - 38 Parts",
    byline: "MakerWorld",
    searchTerms: "MakerWorld lego star wars",
    category: "Toys & Games",
    image: "lego-star-destroyer.png",
    likes: "21.6k",
    downloads: "56.1k",
  },
  {
    title: "Cable Organiser/Cable Clip",
    byline: "MakerWorld",
    searchTerms: "MakerWorld cable organiser clip",
    category: "Household",
    image: "cable-organiser.png",
    likes: "4.8k",
    downloads: "16.4k",
  },
  {
    title: "Water gun - WG-X01",
    byline: "MakerWorld",
    searchTerms: "MakerWorld water gun",
    category: "Toys & Games",
    image: "water-gun.png",
    likes: "9.2k",
    downloads: "27.9k",
  },
  {
    title: "Decorative Fruit Fly Trap",
    byline: "MakerWorld",
    searchTerms: "MakerWorld fruit fly trap",
    category: "Household",
    image: "fruit-fly-trap.png",
    likes: "18.5k",
    downloads: "44.6k",
  },
  {
    title: "DD19.2 (Glock) - Functional Toy",
    byline: "MakerWorld",
    searchTerms: "MakerWorld functional toy",
    category: "Toys & Games",
    image: "dd19-toy.png",
    likes: "7.1k",
    downloads: "22.8k",
  },
  {
    title: "Shade pegboard collection | Bins, Hooks & storage",
    byline: "MakerWorld",
    searchTerms: "MakerWorld pegboard bins hooks storage",
    category: "Tools",
    image: "pegboard-collection.png",
    likes: "13.9k",
    downloads: "35.2k",
  },
  {
    title: "Belt Holder/Organizer (New Improved Model)",
    byline: "MakerWorld",
    searchTerms: "MakerWorld belt holder organizer",
    category: "Household",
    image: "belt-holder.png",
    likes: "5.7k",
    downloads: "17.6k",
  },
  {
    title: "UCS Millennium Falcon 75192 - Bags 1-3",
    byline: "MakerWorld",
    searchTerms: "MakerWorld millennium falcon star wars",
    category: "Toys & Games",
    image: "millennium-falcon.png",
    likes: "11.3k",
    downloads: "29.4k",
  },
  {
    title: "USB Motorized Butterfly Figurine",
    byline: "MakerWorld",
    searchTerms: "MakerWorld usb butterfly figurine",
    category: "Art",
    image: "butterfly-figurine.png",
    likes: "16.8k",
    downloads: "48.5k",
  },
  {
    title: "Cleaner PRO | Charging Port | USB C | Lightning",
    byline: "MakerWorld",
    searchTerms: "MakerWorld charging port cleaner usb",
    category: "Tools",
    image: "port-cleaner.png",
    likes: "3.9k",
    downloads: "12.7k",
  },
  {
    title: "Generative 3D Floor Plans",
    byline: "MakerWorld",
    searchTerms: "MakerWorld generative floor plans",
    category: "Generative 3D Model",
    image: "floor-plans.png",
    likes: "10.6k",
    downloads: "31.8k",
  },
  {
    title: "SIG Sauer P365 Fidget Keychain – Slide-Action Toy",
    byline: "MakerWorld",
    searchTerms: "MakerWorld fidget keychain toy",
    category: "Toys & Games",
    image: "fidget-keychain.png",
    likes: "14.1k",
    downloads: "39.6k",
  },
  {
    title: "Monitro Dragon",
    byline: "MakerWorld",
    searchTerms: "MakerWorld dragon miniature",
    category: "Miniatures",
    image: "monitro-dragon.png",
    likes: "6.8k",
    downloads: "20.5k",
  },
  {
    title: "Heavy-Duty Wall Hook / Utility Bracket Compact",
    byline: "MakerWorld",
    searchTerms: "MakerWorld wall hook utility bracket",
    category: "Household",
    image: "wall-hook.png",
    likes: "19.4k",
    downloads: "52.3k",
  },
  {
    title: "PRMGR BC-6 (Beverage Carrier 6)",
    byline: "MakerWorld",
    searchTerms: "MakerWorld beverage carrier",
    category: "Household",
    image: "beverage-carrier.png",
    likes: "8.1k",
    downloads: "26.7k",
  },
  {
    title: "Pick-Up J79 Single Cab - Kit Card",
    byline: "MakerWorld",
    searchTerms: "MakerWorld pick-up kit card",
    category: "Toys & Games",
    image: "pickup-kit-card.png",
    likes: "12.9k",
    downloads: "37.4k",
  },
].map((model) => ({ ...model, image: assetUrl(model.image) }));

/** Figma 9292:5043 — MakerWorld tab: search, categories, featured banner, trending grid. */
export function MakerWorldPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredModels = TRENDING_MODELS.filter(
    (model) =>
      (category === "All" || model.category === category) &&
      (normalizedQuery.length === 0 ||
        (model.title + " " + model.searchTerms)
          .toLocaleLowerCase()
          .includes(normalizedQuery)),
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="makerworld-page" aria-label="MakerWorld">
      <div className="makerworld-page__content">
        <section className="makerworld-page__search" aria-label="Search and categories">
          <NewTabSearch ref={searchRef} value={query} onChange={setQuery} />
          <div
            className="makerworld-page__categories"
            role="group"
            aria-label="Model categories"
          >
            {CATEGORIES.map((label) => (
              <button
                key={label}
                type="button"
                className={[
                  "makerworld-category-chip",
                  label === category ? "is-active" : "",
                ].filter(Boolean).join(" ")}
                aria-pressed={label === category}
                onClick={() => setCategory(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section
          className="makerworld-banner"
          aria-labelledby="makerworld-banner-title"
        >
          <div className="makerworld-banner__copy">
            <p className="makerworld-banner__eyebrow">Featured collection</p>
            <h2 id="makerworld-banner-title" className="makerworld-banner__title">
              Hiking Utilities
            </h2>
            <p className="makerworld-banner__meta">
              21 models · 4.2k followers · curated by Scarlett
            </p>
            <div className="makerworld-banner__actions">
              <Button variant="primary" color="brand" leftIcon={false} rightIcon={false}>
                View collection
              </Button>
              <Button color="base" leftIcon={false} rightIcon={false}>
                Browse models
              </Button>
            </div>
          </div>
          <div className="makerworld-banner__image">
            <img src={assetUrl("banner-hiking.png")} alt="" />
          </div>
        </section>

        <section
          className="makerworld-page__section"
          aria-labelledby="makerworld-trending-title"
        >
          <div className="makerworld-page__section-header-row">
            <div className="makerworld-page__section-heading">
              <h2 id="makerworld-trending-title">Trending now</h2>
              <p>Popular models for your printers</p>
            </div>
            <Button
              color="base"
              leftIcon={false}
              rightIcon={<FigmaIcon name="chevron-right-small" size={20} />}
            >
              See all
            </Button>
          </div>
          {filteredModels.length > 0 ? (
            <div className="makerworld-page__grid">
              {filteredModels.map((model) => (
                <ProductCard
                  key={model.title}
                  title={model.title}
                  byline={model.byline}
                  image={model.image}
                  likes={model.likes}
                  downloads={model.downloads}
                />
              ))}
            </div>
          ) : (
            <p className="makerworld-page__empty">
              No models match your search.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
