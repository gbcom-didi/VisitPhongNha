--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(100) NOT NULL,
    summary text NOT NULL,
    main_image_url character varying(500),
    publication_date timestamp without time zone NOT NULL,
    location_ids text,
    latitude numeric(10,6) NOT NULL,
    longitude numeric(10,6) NOT NULL,
    tags text[],
    content_html text NOT NULL,
    map_overlay text,
    external_url character varying(500),
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.articles OWNER TO neondb_owner;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.articles_id_seq OWNER TO neondb_owner;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: business_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.business_categories (
    id integer NOT NULL,
    business_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.business_categories OWNER TO neondb_owner;

--
-- Name: business_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.business_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.business_categories_id_seq OWNER TO neondb_owner;

--
-- Name: business_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.business_categories_id_seq OWNED BY public.business_categories.id;


--
-- Name: businesses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.businesses (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    address text,
    phone character varying(20),
    email character varying(255),
    website character varying(500),
    hours text,
    image_url character varying(1000),
    gallery text[],
    owner_id character varying,
    tags text[],
    price_range character varying(100),
    amenities text[],
    booking_type character varying(20) DEFAULT 'none'::character varying,
    affiliate_link character varying(500),
    direct_booking_contact character varying(255),
    enquiry_form_enabled boolean DEFAULT false,
    featured_text character varying(255),
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    reviews jsonb,
    google_maps_url character varying(500),
    is_active boolean DEFAULT true,
    is_premium boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_recommended boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    booking_com_url character varying(500),
    agoda_url character varying(500)
);


ALTER TABLE public.businesses OWNER TO neondb_owner;

--
-- Name: businesses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.businesses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.businesses_id_seq OWNER TO neondb_owner;

--
-- Name: businesses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.businesses_id_seq OWNED BY public.businesses.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    color character varying(7) NOT NULL,
    icon character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO neondb_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: guestbook_comment_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guestbook_comment_likes (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    comment_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guestbook_comment_likes OWNER TO neondb_owner;

--
-- Name: guestbook_comment_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guestbook_comment_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guestbook_comment_likes_id_seq OWNER TO neondb_owner;

--
-- Name: guestbook_comment_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guestbook_comment_likes_id_seq OWNED BY public.guestbook_comment_likes.id;


--
-- Name: guestbook_comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guestbook_comments (
    id integer NOT NULL,
    entry_id integer NOT NULL,
    author_id character varying NOT NULL,
    author_name character varying(255) NOT NULL,
    comment text NOT NULL,
    likes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    parent_comment_id integer,
    status text DEFAULT 'pending'::text
);


ALTER TABLE public.guestbook_comments OWNER TO neondb_owner;

--
-- Name: guestbook_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guestbook_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guestbook_comments_id_seq OWNER TO neondb_owner;

--
-- Name: guestbook_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guestbook_comments_id_seq OWNED BY public.guestbook_comments.id;


--
-- Name: guestbook_entries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guestbook_entries (
    id integer NOT NULL,
    author_id character varying NOT NULL,
    author_name character varying(255) NOT NULL,
    message text NOT NULL,
    nationality character varying(100),
    location text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    related_place_id integer,
    rating integer,
    likes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    status text DEFAULT 'pending'::text,
    is_spam boolean DEFAULT false,
    spam_score integer DEFAULT 0,
    moderated_by text,
    moderation_notes text,
    ip_address text,
    user_agent text,
    moderated_at timestamp without time zone
);


ALTER TABLE public.guestbook_entries OWNER TO neondb_owner;

--
-- Name: guestbook_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guestbook_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guestbook_entries_id_seq OWNER TO neondb_owner;

--
-- Name: guestbook_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guestbook_entries_id_seq OWNED BY public.guestbook_entries.id;


--
-- Name: guestbook_entry_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guestbook_entry_likes (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    entry_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guestbook_entry_likes OWNER TO neondb_owner;

--
-- Name: guestbook_entry_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guestbook_entry_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guestbook_entry_likes_id_seq OWNER TO neondb_owner;

--
-- Name: guestbook_entry_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guestbook_entry_likes_id_seq OWNED BY public.guestbook_entry_likes.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: user_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_likes (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    business_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_likes OWNER TO neondb_owner;

--
-- Name: user_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_likes_id_seq OWNER TO neondb_owner;

--
-- Name: user_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_likes_id_seq OWNED BY public.user_likes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying(20) DEFAULT 'viewer'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: business_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_categories ALTER COLUMN id SET DEFAULT nextval('public.business_categories_id_seq'::regclass);


--
-- Name: businesses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.businesses ALTER COLUMN id SET DEFAULT nextval('public.businesses_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: guestbook_comment_likes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comment_likes ALTER COLUMN id SET DEFAULT nextval('public.guestbook_comment_likes_id_seq'::regclass);


--
-- Name: guestbook_comments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comments ALTER COLUMN id SET DEFAULT nextval('public.guestbook_comments_id_seq'::regclass);


--
-- Name: guestbook_entries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entries ALTER COLUMN id SET DEFAULT nextval('public.guestbook_entries_id_seq'::regclass);


--
-- Name: guestbook_entry_likes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entry_likes ALTER COLUMN id SET DEFAULT nextval('public.guestbook_entry_likes_id_seq'::regclass);


--
-- Name: user_likes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_likes ALTER COLUMN id SET DEFAULT nextval('public.user_likes_id_seq'::regclass);


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.articles (id, title, author, summary, main_image_url, publication_date, location_ids, latitude, longitude, tags, content_html, map_overlay, external_url, is_featured, is_active, created_at, updated_at) FROM stdin;
1	Discovering the World's Biggest Cave	Ben Mitchell	The remarkable discovery of Hang Son Doong and its impact on Vietnamese caving tourism.	/images/inspiration/AStorySpanningDecadesDiscoveringtheWorldBiggestCave.jpg	2017-09-07 00:00:00	201	17.546800	106.289900	{caves,adventure,history}	<p>Nowadays, weekly tours visit the Son Doong Cave during what are the dryer months of the year, between January and August. There are many versions of the discovery story of Son Doong getting about on the internet. Here is another one…</p>\n\n  <p>The story starts for the telling in 1990. Members of the British Caving Association have been coming to Phong Nha since 1990 to explore the caves and valleys in the area. In 1989, Howard and Deb Limbert sent letters to the governments of Laos, Burma (Myanmar) and Vietnam requesting permission to explore the caves of each country in remote areas. They never heard back from Laos or Myanmar, which was known then as Burma. Vietnam responded and in a nutshell said “come on over and knock yourself out.”</p>\n\n  <p>The cave enthusiasts were referred to a university in Ha Noi where they would be taken care of and pointed in the right direction. The geologists from the university suggested Ha Long, Ninh Binh, Ha Giang and Mai Chau as possible locations to explore caves and these locations were all visited on that initial trip. However, one of the geology lecturers at the university was from Quang Binh Province and he suggested that the group explore there towards the end of their trip. He explained that he’d been told about stories of Phong Nha Cave growing up but he had not not been there.</p>\n\n  <p>The group of cavers rented an old yellow school bus as their method of travel, with the help of the university staff. It took four days in 1990 to drive from Ha Noi to Quang Binh, before the roads we know today were built, the team travelled on the rough Highway 1 with ferries crossing the rivers instead of bridges. In those days, even getting from the coast of Quang Binh to inland Phong Nha was an arduous full day of travelling on small laneways and cattle paths.</p>\n\n  <p>On arrival in Phong Nha, the group of Brits found munitions piles, old weapons and unexploded ordnance of the US Military (UXO’s) piled up in the front yards of the villager’s huts. They were being sold as scrap metal. There was one brick building in the town, which they found to be a makeshift village hall. This was their home for the following 9 days; the cavers are by nature a resilient breed and they thrive on uncomfortable travel adventures.</p>\n\n  <p>Upon settling in, they proceeded to explore what are now known as Phong Nha Cave and Dark Cave (Hang Toi). Three from the team delved over 8km into Phong Nha Cave and to this day nobody has been back in that far. Howard Limbert, who was on the expedition, likes to say: “less people have been to the end of Phong Nha Cave, than people have been to the moon”, although 100,000’s of tourists now visit the first 1km of the cave every year.</p>\n\n  <p>The group that went right through the length of the Dark Cave found some enormous caverns deep in the cave and some that are located and begin in the area of what is now known as the Abandoned Valley. All of these caves and areas are now visited daily by tourists visiting Phong Nha Ke-Bang National Park.</p>\n\n  <p>Around the same time in 1990, as this expedition was taking place in some of the easier to access caves on the edge of the Karst Massif that now makes up the Phong Nha Ke-Bang Unesco World Heritage area, a young 16 year old local boy named Ho Khanh was hunting with family members deep in the more recently labelled “core zone” of the park.</p>\n\n  <p>At that time, it was a good 20km trek through dense jungle in this relatively unexplored region of the planet, over treacherous mountains shielded by sharp weathered limestone.</p>\n\n  <p>Ho Khanh was separated from the rest of the group, and when a thunderstorm passed he found shelter under an overhanging cliff. When the weather cleared, he noticed what seemed to be clouds bellowing out from the side of the mountain, not even 20m away from where he was stationed. On closer inspection, Ho Khanh found a cave entrance that upon entering by 10 meters saw that the floor dramatically fell away in a sheer cliff, into what seemed like the depths of a dark abyss of nothingness below.</p>\n\n  <p>Ho Khanh left the cave and sought out to find the rest of the hunting party and continued with his day-to-day life.</p>\n\n  <p>In 1994, the Vom Cave System was extensively explored and Paradise Cave visited everyday now by tourists is part of said Vom Cave System, with its labyrinth being physically the longest cave in Vietnam. In 2005 the entrance to Paradise Cave was located from the outside by a local man named Phuong. Mr Phuong happens to be Ho Khanh’s brother-in-law.</p>\n\n  <p>The families of exceptional experienced jungle men all live at the western end of Phong Nha Village, where Ho Khanh and many of the other local families now operate really cool little homestay accommodations for the increasing amount of visitors to the area.</p>\n\n  <p>Fast-forward around a decade to 2005 at which time Ho Khanh was introduced to the now locally seasoned Howard and Deb and the other British cavers who had been caving here every other year or so since the first expedition in 1990. Ho Khanh met Howard and Deb’s group in 2003 and told them that he knew of many caves and seen the many cave entrances over decades of growing up and hunting in the local Jungle. He hadn’t explored them, but this didn’t surprise the Limbert’s or their exploring companions as this was a normal situation for the local people.</p>\n\n  <p>They tended to avoid going beyond the entrance to the caves in the region. There were some exceptions, like Hang En Cave which was used by the Ban Doong minority tribe as a thoroughfare and Phong Nha Cave and Hang Rou which were used during the war for storage and the production of rice wine respectively. Prior to around 2005 the local people here didn’t have flashlights so the darkness of the caves were hard to navigate and besides, it was a widespread superstition of the local people that caves harboured spirits.</p>\n\n  <p>Khanh continued to tell the British cavers about the cloudy cave entrance he discovered when he was seeking shelter whilst hunting as a young boy, located just after and above the waterways of Hang En and Hang Curry converge. Khanh, couldn’t remember the exact location but agreed he’d try to find it for a future expedition.</p>\n\n  <p>In 2009 an expedition was officially organised and led by Howard and Deb Limbert, to explore in this area beyond Hang En and over the mountains, past the dolines of Hang Son Doong, finishing to the north on the National Park’s rugged core zone on Highway 20 somewhere between Hang Tam Co, 8 Ladies Cave and the “A Rem” Minority Village near the Laos border.</p>\n\n  <p>The cavers were guided by Khanh to the entrance of what he’d simply described as a cave he’d seen with clouds coming out. A caver named Adam Spillane was the first to enter. Just beyond the entrance it was found that the cavers would have to descend the steep cliff into the darkness. The group upon exploring some of the interior of the cave were completely breath taken by the sheer dimensions of the caverns found as they moved north, farther into the cave.</p>\n\n  <p>The plan to cross the mountains to Highway 20 was abolished and the rest of the time was spent exploring Hang Son Doong.</p>\n\n  <p>In 2010, the Cavers returned with the National Geographic magazine and TV team to further explore and map the cave. It was proven that by volume that Hang Son Doong is the largest Cave discovered in the world, outrunning Deer Cave in Malaysia, which previously held that distinction.</p>\n	\N	\N	t	t	2025-06-30 03:27:29.124932	2025-06-30 03:27:29.124932
2	Epic Eco Travel Shares Experience of Phong Nha and Vietnam	Epic Eco Travel	A personal travel blog about sustainable tourism and the beauty of Phong Nha.	/images/inspiration/EpicEcoTravelSharesExperiencePhongNhaVietnam.jpg	2017-10-19 00:00:00	101	17.555000	106.288000	{eco,sustainable,tourism}	<p><strong>Vietnam is a place of exquisite beauty, culture, and wonder!</strong></p>\n\n  <p>A recent visitor and travel blogger has written this great blog article about his experience of Phong Nha and Vietnam. The article includes reviews of the accommodation and activities during the visit, including kayaking, hiking and cave exploration.</p>\n\n  <p>The article highlights the trending topic of sustainable tourism in Vietnam, “as more and more locals realize their livelihood depends on the survival of their surrounding environment”. As tourism rises, small communities such as Phong Nha are striving to protect the natural beauty and authenticity of the area. Conservation projects ensure that the wildlife is protected and the community strives to recycle and up-cycle waste and unwanted materials.</p>\n\n  <p><em>Epic Eco Travel’s article</em> also features a brief review and photos of <strong>Victory Road Villas</strong>, the first luxury boutique accommodation in Phong Nha. Newly opened in September 2017, Victory Road Villas has made a fantastic impression as it introduces a higher standard of accommodation to the area. The accommodation is beautifully constructed and decorated, successfully fusing French colonial style and traditional Vietnamese style.</p>\n\n  <div style="margin-top: 20px;">\n    <iframe width="560" height="315" src="https://www.youtube.com/embed/A8isTxiYJ3s" title="Epic Eco Travel Video" frameborder="0" allowfullscreen></iframe>\n  </div>	\N	\N	t	t	2025-06-30 03:27:29.371805	2025-06-30 03:27:29.371805
3	Vietnam's Hidden Natural Wonders: An Adventure Trip	David Scherz	An adventure from Phong Nha to Ha Giang exploring hidden gems of Vietnam.	/images/inspiration/VietnamHiddenNaturalWondersAdventureTrip.jpg	2017-10-27 00:00:00	101,301	17.558000	106.292000	{adventure,tours,nature}	<p><strong>High up in the mountains and deep in the jungle - here you will find: untouched nature and authentic people.</strong></p>\n\n  <p>David Scherz passionately documents his adventure trip to Vietnam in his twice published article <em>Vietnam: Hidden Natural Wonders</em>, published in <strong>Reiselust</strong> magazine and <strong>Traveller Online</strong>. His journey takes him through <strong>Phong Nha Ke-Bang</strong> on a <strong>Jungle Boss</strong> 2-day tour, to the breathtaking scenery of <strong>Ha Giang</strong> in north Vietnam, with intervals in the “mega-city” of <strong>Hanoi</strong> and a short beach rest stop in <strong>Da Nang</strong>. Read the full article translated from German below.</p>\n\n  <p>The trip begins with <strong>Phong Nha Ke-Bang National Park</strong>, where the “crystal clear water” of <strong>Ma Da Lake</strong> is described by Scherz as he takes on the 2-day <strong>Ma Da and Abandoned Valley tour</strong> with Jungle Boss through the park. The tour explores the “gigantic” <strong>Elephant Cave</strong>, but what he finds more thrilling is the cave swimming in <strong>Tra Ang cave</strong>, where the experience of total darkness and silence in the cave, as he puts it, is <em>“a very powerful feeling, and possibly a real once-in-a-lifetime moment.”</em></p>\n\n  <blockquote>\n    <p>We begin into the water and swam 600 meters into the cave, everything around us completely darkened, and it was silent and still. 30 meters above us the ceiling, 20 meters below us the floor - a very powerful feeling, and possibly a real once-in-a-lifetime moment.</p>\n  </blockquote>\n\n  <p>David Scherz holds a strong focus on the authentic and untouched areas of Vietnam within his trip and his writing – places that are hidden or unknown to the typical tourist in Vietnam. At one point in the article, he specifically mentions avoiding the northern town of <strong>Sapa</strong>, which has recently and rapidly become saturated with tourism, to pursue the more authentic area of <strong>Ha Giang</strong>.</p>\n\n  <blockquote>\n    <p>The landscape above and around Sa Pa is one of the highlights, according to the many tourists and correspondingly the many hotels that are rising from the ground... we must go further north, up to the Chinese border, to the secluded Ha Giang Province.</p>\n  </blockquote>\n\n  <p>There are countless serpentines going up and up, past secluded mountain villages, surrounded by lush greenery and lush vegetation. We feel as if we were in the middle of a documentary about the universe, it is so unbelievably beautiful here.</p>\n\n  <p>At the end of the article, Scherz includes his list of <strong>“The most important info for your travel to Vietnam…”</strong> featuring <strong>Phong Nha Farmstay</strong> for accommodation alongside <strong>Jungle Boss Tours</strong> for activities in Phong Nha.</p>	\N	\N	t	t	2025-06-30 03:27:29.606673	2025-06-30 03:27:29.606673
4	Make Your Own Vietnamese Hat in Phong Nha	Ben Mitchell	Join a hands-on conical hat making workshop in Bong Lai Valley.	/images/inspiration/MakeYourOwnVietnameseHatPhongNha.jpg	2017-11-25 00:00:00	202	17.544000	106.276000	{culture,workshop,heritage}	 <p><strong>Have you ever wondered how the iconic Vietnamese conical hat (Non La Viet) is made?</strong> And have you ever wondered why the Vietnamese people are so sun-smart? Well, the answer to one of these questions can be answered at the <strong>Wild Boar Eco Farm</strong> in the beautiful <strong>Bong Lai Valley</strong> where you can now learn how to make your very own Vietnamese hat!</p>\n\n  <p>The <strong>Bong Lai Valley</strong> is already a popular day out for many travellers and holidaymakers, offering breathtaking rural scenery and the opportunity to experience the real Vietnamese countryside and farming life. The recently launched <strong>Vietnamese hat making workshop</strong> at Wild Boar Eco Farm is a very welcomed addition to the already existing cultural activities in the Valley, alongside <em>The Duck Stop</em> and <em>The Pub With Cold Beer</em>.</p>\n\n  <p><strong>Wild Boar Eco Farm</strong> is run by Mr. Cuong and his family and is not only the place to go these days for Vietnamese hat making and seeing wild boar, but is also a fantastic spot for swimming in the river or chilling out in a hammock with a beer and admiring the best views of the Valley. Another interesting way to appreciate the views here is by swinging right over them – yes, you read that right – you can swing over the picturesque views on the aptly named <strong>“Death Swing”</strong>. If that's not up your street, then maybe just stick to the hammocks and hat making. Food is also served here in the form of traditional pork or chicken and comes at a very reasonable price.</p>	\N	\N	t	t	2025-06-30 03:27:29.841746	2025-06-30 03:27:29.841746
5	Altars, Incense and the Celebration of Death	Ben Mitchell	Explores Vietnamese ancestor worship traditions, death anniversaries, and the cultural meaning behind altars and incense rituals.	/images/inspiration/AltarsIncenseandtheCelebrationofDeath.jpg	2017-12-09 00:00:00	\N	17.555700	106.287100	{Culture,Heritage,"Phong Nha",Vietnam}	<p>In Western culture, the concept of celebrating death may seem rather alien to us, not to mention a bit macabre. The topic of death and events such as funerals are something we tend not to dwell on or discuss. Our culture forces us to mourn and remember our loved ones in seclusion and privacy and we attempt to distract ourselves from all the emotions and swiftly return to the “normality” of our lives. There are no particularly special events held post-funeral, and the subsequent death anniversaries are sad days often spent in solitude or amongst only the closest of family.</p>\n\n  <p>That is not the case for a large majority of the Vietnamese people, also known as the <strong>Kinh</strong> people, who celebrate death anniversaries. Death anniversaries (<em>ngày giỗ</em>) are amongst the most important dates of the year alongside <strong>Tết</strong>, the Vietnamese New Year celebration. In Vietnam, death anniversaries are sacred times at which to focus on the happiness and good that the person brought to the world. Death anniversaries bring the family and close friends together, to not only embrace the presence of their deceased loved one’s spirit, but also to truly embrace the presence of their living family members too.</p>\n\n  <p>These occasions are always joyful ones and a great excuse for catching up with family and friends, feasting on delicious foods and heartily drinking. Most families celebrate several <em>ngày giỗ</em> per year, and usually the death anniversary of an ancestor is celebrated for following three generations.</p>\n\n  <p>Food is an integral part of this celebration. The women of the family will spend the whole day, and maybe even the whole day before, preparing and cooking the deceased person’s favourite dishes, and also many other sweet and savoury Vietnamese specialties. One of these is likely to be <strong>bánh ít</strong>; a sweet rice roll which is pyramidical in shape and filled with caramelised crushed peanuts and wrapped in banana leaf. Fresh chicken and pork dishes are also popular at these feasts. Sometimes, if the party is really big, the family will hire external caterers to take care of all the food and a huge marquee filling the yard and overflowing onto the streets.</p>\n\n  <p>Every family’s house has an altar or shrine which is placed in the most prominent possible position in the home, usually in the main common space or largest room and facing towards an entrance. Some altars are very large and in the form of a cabinet whereas others are smaller and shelf-like and affixed to the wall. Many families will have three or more altars, often arranged one atop of another, creating levels ascending like a pyramid.</p>\n\n  <p>The altar is the focal point for the family’s religious services to their ancestors, and in the eyes of the family it makes each home the equivalent to Rome in Christianity; the pinnacle of religious status. The Kinh people worship their ancestors and treat the ancestral home as the most sacred place.</p>\n\n  <p>The altar displays and stores the family’s most prized possessions, which are protected by the family’s spirits. If the altar is large enough, the family’s rice supply for the year is stored here too. On the death anniversary, the elaborate banquet will be laid out around or on the shrine and is offered firstly to the spirit of the loved one. Cooked and uncooked rice, hot rice soup, green tea, rice wine and incense are amongst some of the mandatory offerings, alongside photographs, memorabilia, flowers, various gifts and candles. The burning of paper items such as fake paper money is another common practice and this is a form of gift giving for the dead. Other paper items such as paper motorbikes, paper cars and paper toys for children are also common for this ritual, which is always carried out by the eldest patrilineal family member.</p>\n\n  <p>The Kinh believe that the smoke from the burning incense will guide the dead to safety or safe passing, and will also guide them back home on days like these. The spirit cannot taste the food, but the spirit can smell the food, and can also smell the incense and flowers. The family members each light their own incense sticks and place it at the shrine to burn. When all of the incense has burned, it means the spirit has finished feasting, so the rest of the family can now rearrange the food for themselves and then tuck-in and enjoy each other’s company.</p>\n</article>	\N	\N	f	t	2025-06-30 03:27:30.078627	2025-06-30 03:27:30.078627
6	Clothes for Big People	Ben Mitchell	A look at the challenges of finding clothes for big people in Vietnam, with tips and humorous anecdotes from expats.	/images/inspiration/ClothesforBigPeople.jpg	2017-12-23 00:00:00	\N	17.555700	106.287100	{Culture,Shopping,Vietnam}	<p>Clothes and shoes can be hard to buy in Vietnam for the adult westerner. A friend of mine wanted to buy a suit jacket in a “big size”. He tried finding one in the nearest city of Dong Hoi with no luck, and also tried looking in Hue, to no avail. He then went to Hanoi to acquire one and thought it may be better to try phoning around beforehand to investigate what the best options were. He rang H&amp;M, an international clothing retail store, and they said they had big sizes. He jumped in a cab and hightailed it across town to take a look. When he got there, they actually didn’t have anything that even remotely came anywhere close to fitting him. He tried a few more places and eventually gave up after he called an outlet called Adam Store on Truc Bac Lake and asked, “do you have big sized clothes?”. The shop assistant replied saying “sorry, but we only have clothes that fit people weighing up to 80kg”, and that my friend “sounded much heavier than that”.</p>\n\n  <p>I have heard about many instances in Dong Hoi City where Western women have been refused entry into boutique clothing stores, with the sales staff saying “no, no, no, you very big, we only have small size, no foreigner, no foreigner”. It’s a bit embarrassing, but the Vietnamese obviously don’t seem to think so. When I meet a Vietnamese person for the first time, more often than not, they will ask my name, where I’m from, my age, marital status, and then after telling them I’m married, they will ask how many children I have. Lastly, if it hadn’t already been asked, they almost always ask how much I weigh followed by patting my belly. This is followed by looks of disbelief when I inform them that I weigh over 100kg and an onslaught of jokes about lucky money and happy buddha.</p>\n\n  <p>Phong Nha, despite being a small town, has a handful of clothing outlets with “big sizes”. <strong>Wild Phong Nha</strong> sells long pants, jackets, lightweight tops and trekking shoes in Western sizes and is owned by Mr. Bamboo, who is a local cave guide and learned his trade from running adventure tours in Da Lat.</p>\n\n  <p>Another great place in town to buy clothes is <strong>Phuc Dat Shop</strong>. Phuc Dat specialises in unique Phong Nha orientated t-shirts, hats and fleeces and other handmade souvenirs. There is the local market too, but it can be an odd shopping experience where you may find what you’re looking for or you may find yourself bewildered. Be sure to bargain with the merchants at the market and try before you buy.</p>	\N	\N	f	t	2025-06-30 03:27:30.315937	2025-06-30 03:27:30.315937
7	Great Books and Movies about Vietnam	Ben Mitchell	Recommended books and movies offering deep insights into Vietnam's history, culture, and the American War.	/images/inspiration/GreatBooksMoviesaboutVietnam.jpg	2017-12-27 00:00:00	\N	14.058300	108.277200	{Heritage,History,Literature,Movies}	<p>\n    They say whatever you're looking for, you will find here. They say you come to Vietnam and you understand a lot in a few minutes, but the rest has got to be lived. The smell: that's the first thing that hits you, promising everything in exchange for your soul. And the heat. Your shirt is straightaway a rag. You can hardly remember your name, or what you came to escape from. But at night, there's a breeze. The river is beautiful. You could be forgiven for thinking there was no war; that the gunshots were fireworks; that only pleasure matters. A pipe of opium, or the touch of a girl who might tell you she loves you. And then, something happens, as you knew it would. And nothing can ever be the same again.\n  </p>\n  <p>\n    Thomas Fowler, The Quiet American<br>\n    Grahame Green\n  </p>\n  <p>\n    Having lived in Vietnam 12 years and worked in tourism here for 8 years, I often get asked questions about the history and culture of the country. The primary reason for the creation of the Visit Phong Nha website was to answer these questions through the publication of articles and information. This article in particular gives an overview of what I have found to be some very informative and intriguing books and movies about the Far Eastern people of Vietnam and their land. The best way to get under the skin of a country is to study it by looking at it through the eyes of the locals. This article also discusses books and movies about Vietnam that are based on real experiences and historical events. If you are interested in learning more about the history and culture of Vietnam and what makes Vietnam unique, please continue reading to see my personal recommendations for the best movies and books about Vietnam.\n  </p>\n  <p>\n    <strong>Vietnamese Movies</strong>\n  </p>\n  <p>\n    Many Vietnamese movies rely on different substories coming together to weave a complete picture and these stories don’t always end in a happily-ever-after. They often leave you questioning, unlike the well-rounded Hollywood plots we have become so used too. Vietnamese movies don’t exist to make you feel good and aren’t to be enjoyed as a frivolous pastime. They always contain a strong message and are very artistic.\n  </p>\n  <p><strong>The White Silk Dress (2006)</strong><br>Vietnamese with subtitles</p>\n  <p>\n    A romance about two servants from Ha Dong who flee to Hoi An to seek a better life together and escape from the suffering they endure at the hands of their feudal masters. Set on Cam Nam Island near Hoi An (where Randy’s Bookstore is now located) during the French occupation of Vietnam. This movie is a great insight into the unfairness of colonialism and the feudal system that was enforced by the overlords.\n  </p>\n  <p><strong>Cyclo (1995)</strong><br>Vietnamese with subtitles</p>\n  <p>A very dark insight into poverty and the hardships of survival on the streets of Ho Chi Minh City during the 1980’s. Mafia gangs, corruption in the police force, exploitation and vice. This movie exposes what it was really like post-war.</p>\n  <p><strong>The Scent of Green Papaya (1993)</strong><br>Vietnamese with subtitles</p>\n  <p>A love story about a maid who sets out to steal the heart of her employer and strives to become the lady she always wanted to be.</p>\n  <p><strong>The Rebel (2007)</strong><br>Vietnamese with subtitles</p>\n  <p>A contemporary style movie that encompasses martial arts and a love story whilst informing the audience about the past. This is a period drama with plenty of action which retains the typical melancholy that makes Vietnamese movies unique.</p>\n  <p><strong>Foreign Movies</strong></p>\n  <p><strong>The Quiet American (2002)</strong><br>Starring Michael Cain</p>\n  <p>Based on the novel by Graham Greene and mostly filmed in Hoi An due to the town’s architecture. The first film adaptation was made in 1958 and starred Michael Redgrave, but the one I’m recommending here is the adaptation released in 2002. The movie is set during the French Indochina War in Vietnam in 1952 and is a murder mystery that revolves around a love triangle.</p>\n  <p><strong>Oliver Stone’s Vietnam Trilogy</strong><br>Oliver Stone was opposed to the war, yet he volunteered to serve two tours. This was because he thought it was unfair that the less privileged were called to serve through the draft. This lead him to quit university and join the Marines, much to his parents dismay.</p>\n  <ul>\n    <li><strong>Platoon (1986)</strong> – Starring Charlie Sheen</li>\n    <li><strong>Born on the Fourth of July (1989)</strong> – Starring Tom Cruise</li>\n    <li><strong>Heaven & Earth (1993)</strong> – Starring Tommy Lee Jones</li>\n  </ul>\n  <p><strong>Good Morning Vietnam (1987)</strong><br>Starring Robin Williams</p>\n  <p>A radio DJ from the American Army based in Crete is sent to Vietnam to become a “shock jock”, embarrassing the more conservative side of Army Intelligence and making waves with his unorthodox approach. There is an underlying political anti-war theme to the movie but it could also be seen as nostalgic.</p>\n  <p><strong>Indochine (1992)</strong><br>Starring Catherine Deneuve and Vincent Perez</p>\n  <p>An epic masterpiece of a drama about French Indochine. South East Asia’s version of “Out of Africa”, this movie reveals how the French colonial system operated and why it was never going to work.</p>\n  <p><strong>The Sapphires (2012)</strong><br>An Australian film based on a true story about an Indigenous Australian band who performed soul music to American troops in Vietnam during the American War.</p>\n  <p><strong>Vietnamese Publications</strong></p>\n  <ul>\n    <li><strong>The Sorrow of War</strong> by Bao Ninh</li>\n    <li><strong>Heritage Magazine</strong> (Vietnam Airlines Inflight Magazine)</li>\n  </ul>\n  <p><strong>Foreign Publications</strong></p>\n  <ul>\n    <li><strong>Saigon</strong> by Anthony Grey</li>\n    <li><strong>Hanoi Adieu</strong> by Mandaley Perkins</li>\n    <li><strong>The Quiet American</strong> by Graham Greene</li>\n    <li><strong>When Heaven and Earth Changed Places</strong> by Le Ly Hayslip</li>\n    <li><strong>Catfish and Mandala</strong> by Andrew X Pham</li>\n  </ul>\n  <p><strong>Where to Get Books and Movies in Vietnam</strong></p>\n  <p>In Hoi An, Randy’s Bookstore on Cam Nam Island is a great resource. In Phong Nha, books are for sale and exchange at Capture Vietnam alongside great pizza and carrot cake!</p>\n	\N	\N	f	t	2025-06-30 03:27:30.549915	2025-06-30 03:27:30.549915
8	Tết Holiday in Vietnam (Pt.1): An Introduction	Ben Mitchell	An introduction to Vietnam's most important holiday, Tết, exploring its cultural significance and traditions.	/images/inspiration/TetHolidayVietnam1.jpg	2018-01-23 00:00:00	\N	14.058300	108.277200	{Culture,Heritage,"Phong Nha",Vietnam}	<p><strong>Tết</strong> is shortened from <em>Tết Nguyên Đán</em>, which means ‘Feast of the First Morning of the First Day’, and is the biggest and most important festival of the year in Vietnam, lasting up to one week with even a few weeks of aftermath. As the meaning of the name suggests, Tết celebrations begin on the first day of the first month of the lunar calendar, the Lunar New Year, which is also considered to be the arrival of the Spring season.</p>\n\n    <p>Many visitors don’t know what Tết is and if you are at all interested in understanding and experiencing the culture of Vietnam, then Tết is the metaphorical cherry on the cake. We have put together this two-part article to give some background information about this culture-rich celebration and how you can get involved in the celebrations. This year, the first day of Tết is on the 16th of February, so if you are visiting during this time, you should certainly continue reading!</p>\n\n    <p>Tết is hugely important to the Vietnamese for many reasons. In the past, Tết was an essential holiday because it provided one of few longer breaks during the agricultural year, which was held between the harvesting of the crops and the sowing of the next crops. More recently, it is viewed as the time to influence the upcoming year to be full of luck, fortune and success for you, your family and friends. It is also an occasion for the Vietnamese to express their respect and remembrance for their ancestors through various rituals and offerings.</p>\n\n    <p>Similarly to Western traditions for embracing the New Year, for the Vietnamese, Tết is the best time to lay a clean slate, so to speak. Debts are settled, old grievances are forgiven, and houses are cleaned of dirt and clutter, all in the hope of setting the stage for attracting as much luck and good fortune as possible for the year. It is also a time to reminisce on the important events and moments from the previous year, and is seen as an opportunity for families and friends to spend quality time together to drink, eat, and celebrate.</p>\n\n    <p>Vietnamese people usually return to their family homes during Tết, which is often located outside of the big cities, rurally or in the suburbs, so a large percentage of people will travel during this time. Some return to worship at the family altar or visit the graves of their ancestors in their homeland. They also tidy the graves of their ancestors as a sign of respect. The family altar, found in every Vietnamese household, is the focal point of Vietnamese worship, and is doted on all year round, but especially at this time of year. Traditional offerings to the altar include a fruit platter with five kinds of fruit, fake paper money and votive papers, rice, tea, and the burning of incense.</p>\n\n    <p>The three most important days of the holiday are the first three days. The first day is normally reserved for close family, with some regions dedicating the first day to the paternal side of the family. The second day is more relaxed, with many relatives and friends visiting each other’s houses to celebrate. In some parts of Vietnam, the second day is dedicated to the maternal side of the family and the third day is dedicated to teachers, who command a lot of respect in Vietnam.</p>\n\n    <p>Many Vietnamese celebrate by preparing and consuming special holiday food. These foods include <em>bánh chưng</em>, a sticky rice cake filled with pork and mung beans; <em>bánh dầy</em>, a round rice cake served with sausage meat; <em>canh măng</em>, young bamboo soup; and much more. These special foods and beverages shared and eaten over the entire holiday period and generously offered to any visitors to the household, so there must be plenty to go round!</p>\n\n    <p>People consider what they do on the dawn of Tết will determine their fate for the whole year, hence people always smile and treat everyone with the utmost kindness in the hope for a better year. Many families stay at home on the first day of Tết, especially if not invited to another house, and only visit from the second day onwards. During the visiting times, gifts are given to friends and relatives, especially children and the elderly, who are given lucky money in a special red envelope. Also on the first day, everybody will wear brand new clothes, particularly children. The traditional attire is the <em>áo dài</em>, the Vietnamese tunic dress, usually in the colours yellow or red as these are the luckiest colours. Like other Asian countries, Vietnamese believe that the color of red and yellow will bring good fortune, which is why you see the colours everywhere during this period, and of course they are the two colours that make up the Vietnamese flag for this very reason.</p>\n\n    <p>In the days or weeks leading up to the Lunar New Year, in an effort to get rid of the bad luck or misfortune from the previous year, people will spend a few days cleaning their homes, polishing every utensil, or even repaint and decorate the house with kumquat trees (a small citrus fruit), branches of peach blossom, and many other colourful plants and flowers. A significant amount of effort is put into choosing the perfect plants for decorating the home as the size and beauty of the plants reflects wealth, good fortune, and dedication to ancestors and family. For example, the perfect kumquat tree would have to bear not only fully grown fruits but also younger fruits and buds. This is a metaphor for family members both young and old and having a tree like this will bring good health generations of the past, present and future.</p>\n\n    <p>One of the most important traditions observed during Tết is organisation of who will be the first person to enter the family home in the New Year. If good things come to the family on the first day of the Lunar New Year, the year will be full of blessings, so usually a person with sought after qualities such as kindness, good temper and morality will be invited to enter the home first. However, to ensure the best chances of good luck, the owner of the household will leave the house just a few minutes before midnight and come back inside after the clock strikes midnight into the New Year, to prevent anyone else from entering the house who might bring misfortune. Furthermore, it is seen as very bad luck to break anything on the first day of Tết, or to cut your hair or your fingernails. Sweeping during Tết is taboo or <em>xui</em> (unlucky), since it symbolises sweeping the good luck away, that is why they clean before the New Year. It is also <em>xui</em> for anyone who has recently experienced the loss of a family member to visit somebody else’s house during the Tết period, though it is not uncommon for people to visit them at their house instead.</p>\n\n    <p>As you can see, there are countless traditions and beliefs that revolve around this celebration. Tết is a fascinating time to be in Vietnam and to experience authentic Vietnamese culture, and a time to see the Vietnamese people at their very best. Sounds like fun, right? Stay tuned for part two of this article, in which will be advising you on how to make the most of Tết and how to get involved in the celebrations in Phong Nha.</p>	\N	\N	f	t	2025-06-30 03:27:30.867685	2025-06-30 03:27:30.867685
9	Tết Holiday in Vietnam (Pt.2): How to Make the Most of Tết	Ben Mitchell	Advice for travelers on how to make the most of Vietnam's Lunar New Year holiday, Tết, including travel tips and etiquette.	/images/inspiration/TetHolidayVietnam2.jpg	2018-01-26 00:00:00	\N	14.058300	108.277200	{Culture,Heritage,"Phong Nha",Vietnam}	<h1>How to Make the Most of Tết</h1>\n    <p>If you’ve read Part 1 of Tết Holiday in Vietnam, you’ll understand just how much of a major holiday it is for the Vietnamese – imagine Christmas, New Year and Easter all rolled into one! It’s hectic, crazy, busy and noisy, but it is fantastic.</p>\n    <p>Every year we hear two different stories about Tết from travellers: those that loved it, and those that found it a complete nightmare! This comes down to your expectations and how flexible you are willing to be. Most people who really enjoy Tết decide in advance where they want to be for it, arrive a couple of days before and then stay there for the duration (normally 5 days or more). These travellers will try to get involved with the local celebrations as well as relaxing and trying not to do too much, which could be very welcomed after a period of fast-paced traveling. Those that find Tết frustrating are those that try to continue traveling during it and those that just want to do the normal touristic activities like visit museums and attractions. This article is here to help you to be the former and offer advice you on how to enjoy and make the most of this exciting time in Vietnam!</p>\n\n    <h2>Getting around during Tết</h2>\n    <p>Tết is HUGE in Vietnam and a majority of the Vietnamese people will travel back to their family home or hometown for Tết, usually outside of the cities. This causes a mass migration of people traveling from the cities to the countryside before the Lunar New Year and of course returning after it. Due to this, transport for the week before Tết and the week after is often fully booked well in advance, and during the main celebration days of Tết, most transport is not running at all. So it is really important if you want to travel during Tết that you do your research, plan where you want to go and book your travel as far in advance as you can.</p>\n    <p>Bare in mind that you may end up needing to use private transport, such as private cars, and you may end up having to fly or get the train between places rather than taking a bus. Be prepared for transport to be challenging, expensive and busy before and after, and nearly non-existent during. The easiest way to get around this problem is to simply not travel. Choose somewhere you want to spend Tết, book ahead and spend the week there.</p>\n\n    <h2>What to do during Tết</h2>\n    <p>Many tourist attractions will be closed for up to a week for Tết. Museums, places of interest, natural wonders and guided tours and activities can all close! If you want to continue being a tourist during this festival season, plan ahead. Try to think of alternative things to do during this period. Get involved in street celebrations, or befriend local Vietnamese and hang out with them! Tết is the best time to see and experience Vietnamese traditions, culture, food, games, and revelry. Locals will often become more congenial and outgoing during Tết, so it is a great time to make friends. Explore by foot, on bicycles or on scooters, and maybe you’ll be waved down and invited into locals homes and have the opportunity to try the foods that are specially prepared for the festivities. Rice wine is commonly drunk over Tết, so be careful, it’s very strong!</p>\n\n    <h2>Where to stay during Tết</h2>\n    <p>Most accommodations will usually close or operate a limited service due to having fewer staff on hand, so options will be limited and those that are open will be busy. Furthermore, many affluent Vietnamese families will take advantage of the national holiday by traveling to touristic areas to celebrate and enjoy time away from work. Therefore, popular beach areas and touristic towns such as Hoi An will be even busier with more sightseers than usual. Again, it’s really important that you book ahead. Fewer hotels will be open, and those that are will increase their accommodation prices sharply with a high demand in central areas. In Phong Nha, Shambalaa Hostel will be remaining open for Tết. Shambalaa Hostel will also be running a “Tết tour” through the village, giving you the opportunity to meet and celebrate with some of the local families.</p>\n\n    <h2>Where to eat during Tết</h2>\n    <p>Just like hotels, transport, and attractions, many markets and restaurants close during Tết. Nowadays, you can generally always find somewhere local offering food, but for a couple of days at least, expect that #1 TripAdvisor restaurant to be closed and be prepared to settle for something else, or whatever is still open.</p>\n\n    <h2>To sum it up…</h2>\n    <p>At the end of the day, those that enjoy Tết tend to be those that go with the flow and get involved. As previously mentioned, many people go back home to the countryside, so rural areas like Phong Nha are often the best places to experience Tết. So on the contrary to what you may think, it will be more difficult to get involved in Tết if you’re in a city. Cities are vast and hard to get around without transport and Vietnamese people will be few and far between. In rural towns and villages it is easier to get around by foot or bicycle, meet the locals and enjoy the festivities!</p>\n    <p>We highly recommend that you decide where you want to spend Tết in advance, get there, and settle down for the ride. Talk to the hotel staff and find out what is still open and what events are being held that you might be able to attend or enjoy from a distance. You may find that if you befriend the hotel staff, that you will be invited to join them! “Chúc Mừng Năm Mới” is the phrase traditionally used to wish people a Happy New Year, learn it, and don’t be afraid to use it!</p>\n    <p>So, to sum it up… expect to pay a bit more, expect service to be slower, expect the streets to be noisy on Tết Eve; expect traditionally busy areas to be quiet and quiet areas to be busy, expect tourist destinations and restaurants to be closed for a few days and expect travel to be a real pain! Join in with the local celebrations if you want, or chill out at your hotel for a couple of days and pick up that book you’ve been meaning to finish. Be forgiving and flexible, because who can blame these wonderful people for wanting to spend a few days celebrating life and love with their families and friends?</p>\n    <p><strong>Chúc Mừng Năm Mới and good luck to you all!</strong></p>	\N	\N	f	t	2025-06-30 03:27:31.10471	2025-06-30 03:27:31.10471
10	The Elements Collection – a Super Unique Countryside Experience	Ben Mitchell	Discover The Elements Collection, a boutique villa experience in rural Vietnam with private pools and vintage vehicles.	/images/inspiration/TheElementsCollection.jpg	2018-06-26 00:00:00	\N	17.621754	106.368339	{Luxury,Accommodation,"Phong Nha"}	<p>A property consisting of a cluster of 3 Residences. Each Villa boasts 2 Bed Rooms and a Private Pool, your own indoor and outdoor entertainment areas and kitchen and private relaxing spaces. This is the best Vietnam can offer, situated in the real Vietnam.</p>\n    <p>The Elements offer an opportunity to stay in a luxury accommodation, set away from mainstream tourism. We believe these 3 Villas provide an opportunity to experience Vietnam's most Unique Villa experience. “It’s like Ubud, before it was discovered.” said a recent guest.</p>\n    <p>The Villas are in the rural farming village of Khuong Ha, which, while close enough to Phong Nha Village and Farmstay Village to enjoy the benefits of restaurants and bars, it's also very exclusive. The property boasts 3 courtesy Vehicles:</p>\n    <ul>\n        <li>A vintage Russian Ural Motorcycle with Side Car</li>\n        <li>An antique 1968 American Army Jeep</li>\n        <li>A 7 seat Private SUV</li>		https://phongnhafarmstay.com/room/elements-collection/	f	t	2025-06-30 03:27:31.341883	2025-07-18 07:12:33.953
\.


--
-- Data for Name: business_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.business_categories (id, business_id, category_id, created_at) FROM stdin;
989	112	1	2025-08-04 03:12:25.646857
990	115	1	2025-08-04 03:13:26.747513
912	76	2	2025-07-30 03:14:17.488935
991	116	1	2025-08-04 03:14:47.185117
992	117	2	2025-08-04 03:16:01.634718
993	118	2	2025-08-04 04:18:28.492861
994	119	17	2025-08-04 04:19:52.064558
995	119	1	2025-08-04 04:19:52.064558
996	120	2	2025-08-04 04:21:04.804732
997	121	2	2025-08-04 04:22:09.431461
998	122	2	2025-08-04 04:23:07.558941
999	127	1	2025-08-04 04:24:28.7498
922	139	1	2025-07-30 08:25:00.712339
1000	128	1	2025-08-04 04:25:56.614388
1001	129	1	2025-08-04 04:27:13.936951
1002	123	1	2025-08-04 04:28:38.652293
1003	124	1	2025-08-04 04:30:04.76462
1004	125	1	2025-08-04 04:31:24.56646
1005	126	1	2025-08-04 04:32:31.759634
1006	130	2	2025-08-04 04:33:57.244964
1007	131	2	2025-08-04 04:35:09.314707
1008	164	20	2025-08-04 04:36:07.539319
1009	134	1	2025-08-04 04:37:54.738945
937	163	22	2025-08-04 00:54:03.590649
1010	165	22	2025-08-04 04:39:09.650833
939	135	2	2025-08-04 01:02:07.930474
940	78	2	2025-08-04 01:04:45.389416
1011	166	22	2025-08-04 04:40:29.763383
942	79	2	2025-08-04 01:08:10.135749
943	84	1	2025-08-04 01:08:57.816486
944	77	1	2025-08-04 02:11:35.968466
945	77	17	2025-08-04 02:11:35.968466
946	80	2	2025-08-04 02:12:53.351676
947	81	2	2025-08-04 02:14:14.663671
948	83	2	2025-08-04 02:15:45.185147
949	85	2	2025-08-04 02:17:28.682237
950	82	1	2025-08-04 02:19:45.027058
951	82	17	2025-08-04 02:19:45.027058
952	86	1	2025-08-04 02:22:18.353677
953	86	17	2025-08-04 02:22:18.353677
954	87	1	2025-08-04 02:23:43.53669
955	88	2	2025-08-04 02:24:48.525948
956	89	2	2025-08-04 02:25:46.602384
957	90	2	2025-08-04 02:26:52.866262
958	91	1	2025-08-04 02:28:56.668981
959	92	2	2025-08-04 02:30:16.735068
1012	132	2	2025-08-04 04:41:30.095809
1013	133	2	2025-08-04 04:42:32.415311
1014	137	2	2025-08-04 04:43:46.999144
1015	138	2	2025-08-04 04:44:45.317167
1016	136	2	2025-08-04 04:46:01.863232
1017	167	22	2025-08-04 04:47:12.520348
1018	140	1	2025-08-04 04:48:14.623589
1019	141	2	2025-08-04 04:49:09.650991
1020	142	2	2025-08-04 04:50:00.69767
1021	143	1	2025-08-04 04:51:05.936725
1022	148	1	2025-08-04 04:51:58.809456
1023	144	2	2025-08-04 04:52:55.973011
1024	145	2	2025-08-04 04:53:59.889009
1025	146	2	2025-08-04 04:55:33.717955
1026	147	2	2025-08-04 04:56:29.615201
1027	150	1	2025-08-04 04:57:27.223625
1028	151	2	2025-08-04 04:58:36.793238
1029	168	22	2025-08-04 04:59:35.493612
1030	169	22	2025-08-04 05:00:38.077289
1031	152	2	2025-08-04 05:01:41.054863
1032	153	2	2025-08-04 05:02:50.032078
1033	154	2	2025-08-04 05:03:49.314377
1034	149	2	2025-08-04 05:04:58.93396
1035	171	2	2025-08-04 05:08:37.730198
1036	171	1	2025-08-04 05:08:37.730198
1037	170	20	2025-08-04 05:09:39.242523
1038	156	2	2025-08-04 05:10:36.607425
1039	155	2	2025-08-04 05:11:35.320105
1040	158	21	2025-08-07 03:46:27.125773
960	93	2	2025-08-04 02:31:38.575518
961	157	21	2025-08-04 02:32:39.531834
962	94	2	2025-08-04 02:33:56.293634
963	95	2	2025-08-04 02:35:12.847679
965	96	2	2025-08-04 02:36:58.748567
966	97	2	2025-08-04 02:38:19.644063
967	98	2	2025-08-04 02:39:30.11126
968	99	1	2025-08-04 02:40:29.307444
969	100	1	2025-08-04 02:41:48.11803
970	101	2	2025-08-04 02:43:03.451078
971	102	2	2025-08-04 02:44:38.796096
972	103	2	2025-08-04 02:45:39.209779
973	104	1	2025-08-04 02:47:13.629484
975	159	21	2025-08-04 02:52:48.823608
976	160	21	2025-08-04 02:54:16.711096
977	161	21	2025-08-04 02:55:27.705794
979	106	2	2025-08-04 02:58:33.535418
980	105	2	2025-08-04 03:00:10.542535
981	162	20	2025-08-04 03:01:27.872172
982	107	2	2025-08-04 03:02:34.473296
983	108	2	2025-08-04 03:03:33.75443
984	109	2	2025-08-04 03:04:38.275002
985	110	1	2025-08-04 03:08:12.851286
986	111	2	2025-08-04 03:09:20.691791
987	113	2	2025-08-04 03:10:27.047452
988	114	2	2025-08-04 03:11:25.01208
\.


--
-- Data for Name: businesses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.businesses (id, name, description, latitude, longitude, address, phone, email, website, hours, image_url, gallery, owner_id, tags, price_range, amenities, booking_type, affiliate_link, direct_booking_contact, enquiry_form_enabled, featured_text, rating, review_count, reviews, google_maps_url, is_active, is_premium, is_verified, is_recommended, created_at, updated_at, booking_com_url, agoda_url) FROM stdin;
160	Hang Trạ Ang	Hang Trạ Ang is a beautiful cave in Phong Nha–Kẻ Bàng National Park, known for its crystal‑clear underground river and dramatic limestone formations. The cave stretches over 600 meters and features wide passages filled with turquoise water. Visitors reach it via a scenic jungle trek, often combined with swimming or kayaking through the cave’s river. The surrounding Trạ Ang Valley adds to the adventure, with lush forest trails, wildlife, and peaceful picnic spots, making it a perfect off‑the‑beaten‑path experience.	17.49874800	106.26204700	F7X6+FRV, Tân Trạch, Bố Trạch, Quảng Bình	\N	\N	\N	\N	/images/explore/HangTra.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	81	\N	https://maps.app.goo.gl/2K3i5U9PNJt6C2Zk8	t	f	t	f	2025-07-30 02:55:30.154613	2025-08-04 02:54:16.122	\N	\N
159	Hang Sơn Đoòng	Hang Sơn Đoòng is the world’s largest natural cave, located deep within the jungles of Phong Nha–Kẻ Bàng National Park. Stretching over 9 kilometers with soaring chambers up to 200 meters high, it is a geological marvel filled with massive stalagmites, underground rivers, and even its own rainforest.\nAccess to the cave is limited to multi-day expeditions led by expert guides. The journey includes jungle treks, river crossings, camping inside the cave, and climbing the towering “Great Wall of Vietnam.” Hang Sơn Đoòng offers a once-in-a-lifetime adventure for those seeking the extraordinary.	17.46479240	106.28739390	Tân Trạch, Bố Trạch District, Quảng Bình	\N	\N	https://sondoongcave.info/	\N	/images/explore/hangsondoo.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.70	1062	\N	https://maps.app.goo.gl/QxhnxBMJytahz2rWA	t	f	t	f	2025-07-30 02:55:29.68621	2025-08-04 02:52:48.231	\N	\N
161	Hang Va Cave	Hang Va Cave is a remote and striking river cave located in the heart of Phong Nha–Kẻ Bàng National Park, close to the Son Doong system. It is famous for its extraordinary conical stalagmites, known as “tower cones,” and stunning emerald pools that make it one of the most geologically unique caves in Vietnam. The standard expedition involves a two‑day, one‑night adventure with jungle trekking, stream crossings, swimming through cave passages, and climbing vertical sections with safety harnesses. With its pristine formations, challenging terrain, and limited annual access, Hang Va offers an unforgettable experience for fit travelers seeking a true wilderness adventure.	17.49145484	106.28125650	F7RJ+FGR, Hồ Chí Minh Tây, Tân Trạch, Bố Trạch, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/HangVa.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	29	\N	https://maps.app.goo.gl/yMVSPXnbnbn2mqkx9	t	f	t	f	2025-07-30 02:55:30.622029	2025-08-04 02:55:27.128	\N	\N
162	Jungle Boss Trekking Tours Headquarters	Jungle Boss Trekking Tours Headquarters is the central base for guided adventure tours in Phong Nha–Kẻ Bàng National Park. Located near Phong Nha town, it serves as the meeting point for group briefings, equipment preparation, and safety checks before heading into the jungle. From here, guests set out on popular treks such as Elephant Cave, Ma Da Valley, Hang Pygmy, and Kong Collapse. Known for professional guides, small group sizes, and excellent organization, Jungle Boss is a trusted choice for adventurous travelers.	17.61592251	106.32395690	Thôn, Cù Lạc 1, Quảng Bình 511860, Vietnam	+84917800805	\N	https://junglebosstours.com/	\N	/images/explore/jungleboss.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	649	\N	https://maps.app.goo.gl/Rt99MvNkCEiU8QTYA	t	f	t	f	2025-07-30 02:55:31.324268	2025-08-04 03:01:27.292	\N	\N
141	Regal Collection House	Regal Collection House is a stylish 4‑star beachfront property located in the Bảo Ninh area of Đồng Hới, offering beautiful views of both the sea and the river. The building features elegant Indochine‑inspired design and well‑appointed rooms, many with balconies overlooking the coast. Guests can enjoy an indoor pool, beachfront access, a fitness center, and an on‑site restaurant and bar. With its refined design, comfortable facilities, and prime location, it’s an excellent choice for travelers seeking a relaxed yet upscale stay near Phong Nha.	17.45749905	106.64523450	Đường Võ Nguyên Giáp, Bảo Ninh, Đồng Hới, Quảng Bình 47000, Vietnam	\N	\N	\N	\N	/images/explore/RegalCollection.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.70	242	\N	https://maps.app.goo.gl/XsmLZbD4J9SJQq5b8	t	f	t	f	2025-07-30 02:53:57.712812	2025-08-04 04:49:09.048	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=35445329
158	Hang Én Cave	Hang Én, which means Swallow Cave, named for the millions of birds that attach their nests to the large cave’s roof. The local “Bru Van Kieu” Minority tribesman from Ban Doong Village, deep in the jungle, traditionally climb vine ladders to harvest the chicks snd the eggs. Hang En, it’s location, getting there and experiencing it is otherworldly. Described in 2012 by Howard Limbert, the worlds most famous caver as the best “bang for your buck in Vietnam. This cavern is one of the largest natural caves in the world, stretching nearly 1.6 km through a limestone mountain in Phong Nha–Kẻ Bàng National Park. Its enormous entrance, about 100 meters high and 170 meters wide, creates a dramatic gateway to the valley of Son Doong Cave. The journey to Hang Én includes a jungle trek, stream crossings, and visits to local remote villages before reaching the wide sandy riverbank inside the cave where camping takes place. With its stunning natural skylights, vast chambers, and adventurous approach, Hang Én is a breathtaking experience for fit travelers seeking an unforgettable cave expedition.	17.44144020	106.29226320	C7RR+FWR, 565, Tân Trạch, Bố Trạch, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/HangEn.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.70	26	\N	https://maps.app.goo.gl/jQszfgJEBUk1LGuK6	t	f	t	f	2025-07-30 02:55:27.348595	2025-08-07 03:46:27.012	\N	\N
164	Oxalis Adventure Tours	Oxalis Adventure Tours is the leading adventure company in Phong Nha, specializing in guided trekking and caving expeditions. They are the exclusive operator for world‑famous caves such as Hang En, Tu Lan, and Son Doong, offering trips that range from easy one‑day adventures to challenging multi‑day jungle treks. All tours are fully equipped with safety gear, experienced guides, and support teams to ensure both safety and enjoyment. Known for their professionalism, excellent organization, and knowledgeable staff, Oxalis provides unforgettable experiences deep in the heart of Phong Nha–Kẻ Bàng National Park.	17.60058440	106.29509670	Phong NHA, Bố Trạch District, Quảng Bình	+84919900357	\N	https://oxalisadventure.com/	\N	/images/explore/Oxalis.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	1034	\N	https://maps.app.goo.gl/YTaULTHmFEB7BaLt8	t	f	t	f	2025-07-30 02:55:38.119496	2025-08-04 04:36:06.945	\N	\N
165	Phong Nha - Ke Bang National Park	Sprawling national park in lush surrounds featuring a network of wet caves, rivers & waterfalls.	17.47767900	106.13403950	\N	+842323677021	\N	https://phongnhakebang.vn/	\N	/images/explore/PhongNhaKeBang.jpg	{}	\N	{cave}	\N	{}	none	\N	\N	f	\N	4.70	785	\N	https://maps.app.goo.gl/erQ2MnCpRGiTF3by8	t	f	t	f	2025-07-30 02:55:38.586503	2025-08-04 04:39:09.07	\N	\N
166	Phong Nha Botanic Garden	Phong Nha Botanic Garden is a 40‑hectare nature reserve inside Phong Nha–Kẻ Bàng National Park, about 12 km from Phong Nha town. Rather than manicured gardens, it features raw jungle terrain rich with over 500 plant species, towering ancient trees, and wildlife such as monkeys, hornbills, and colorful butterflies. Visitors can follow self‑guided trails leading to the 30‑meter Wind Waterfall and the crystal‑clear Vang Anh Lake, where swimming is possible. With scenic viewpoints, wildlife areas, and tranquil forest paths, it’s an ideal spot for nature lovers seeking an accessible jungle experience.	17.55224990	106.30148910	Việt Nam, ĐT20, Sơn Trạch, Bố Trạch, Quảng Bình	\N	\N	\N	\N	/images/explore/PhongNhaBotanic.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.40	1071	\N	https://maps.app.goo.gl/FmsG5Jdfo5TfWm5o8	t	f	t	f	2025-07-30 02:55:39.053437	2025-08-04 04:40:29.182	\N	\N
167	Phong nha funky beach	Phong Nha Funky Beach is a rustic riverside spot just a short drive from Phong Nha town, set within a grove of bamboo and overlooking calm river waters. This unique destination blends relaxation with fun — visitors can wade, swim, paddle basket boats, try rope swings or balance across simple “monkey bridges” over the water. With sand banks, riverbank swings, and deckchairs inviting sunset watching, it’s a scenic game playground perfect for families and adventurous travelers. Often busy between late afternoon and sunset, the upbeat yet tranquil vibe makes it a memorable spot to unwind after cave tours or jungle trekking.	17.62395531	106.35206040	Cổ Giang, Bố Trạch District, Quảng Bình, Vietnam	+84877712233	\N	\N	\N	/images/explore/Phongnhafunky.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	127	\N	https://maps.app.goo.gl/yNDgJoRdrFGtqrVK7	t	f	t	f	2025-07-30 02:55:40.456556	2025-08-04 04:47:11.938	\N	\N
168	The Duck Stop	The Duck Stop is a fun, family‑run duck farm located in the beautiful Bong Lai Valley near Phong Nha. Visitors can feed and interact with hundreds of ducks and even try the farm’s famous “duck massage,” where the ducks gently nibble at your feet. The experience often includes a ride on their friendly water buffalo through the fields and a taste of homemade snacks like crispy Vietnamese pancakes. With its unique activities and friendly hosts, The Duck Stop is a lighthearted and memorable stop for families and adventurous travelers.	17.60471300	106.36569310	Thôn Khương Hà 3, Hưng Trạch, Bố Trạch, Quảng Bình, Vietnam	+84382906262	\N	\N	\N	/images/explore/TheDuck.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	2093	\N	https://maps.app.goo.gl/njfBtuQR2La4EKNU9	t	f	t	f	2025-07-30 02:55:44.711029	2025-08-04 04:59:34.904	\N	\N
169	The Duck Tang Farm Quang Binh	The Duck Tang Farm (also known as “Duck Tang”) is a charming countryside attraction located in Bong Lai Valley, just a short drive from Phong Nha. This family-run farm offers visitors the chance to feed and interact with playful ducks, stroll around the ponds and rice paddies, and enjoy a refreshing countryside atmosphere. Guests can savor simple homemade snacks and drinks served on rustic bamboo seating surrounded by greenery. With its relaxed vibe, gentle activities, and scenic setting, it’s a delightful stop for families, couples, or anyone wanting a peaceful rural break.	17.60743411	106.37411800	J98C+F29, Hưng Trạch, Bố Trạch, Quảng Bình 470000, Vietnam	\N	\N	\N	\N	/images/explore/TheDuckTang .jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	1050	\N	https://maps.app.goo.gl/GE2QPvmLcjUsoXmw6	t	f	t	f	2025-07-30 02:55:45.178351	2025-08-04 05:00:37.501	\N	\N
83	Bao Ninh beach Resort	Bao Ninh Beach Resort is a relaxing four-star getaway nestled on a private stretch of white‑sand beach in Dong Hoi, just a short drive from Phong Nha‑Kẻ Bàng National Park. Guests can unwind with two outdoor pools (plus a children’s pool), beach volleyball, beachfront loungers and umbrellas, or indulge in spa, sauna, and massage treatments. With three on‑site restaurants, a bar/lounge, tiki‑style pool bar, fitness center, tennis court, and karaoke, the resort suits both families and couples. Attentive staff, free Wi‑Fi and parking, airport shuttle service, and easy access to local tours make it an ideal base for exploring Quảng Bình’s caves and coast.	17.46070850	106.64447530	Đường Võ Nguyên Giáp	+842323854688	\N	\N	\N	/images/explore/BaoNinh1.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.30	929	\N	https://maps.app.goo.gl/mEnkggxmCANfJCAF8	t	f	t	f	2025-07-30 02:53:44.090351	2025-08-04 02:15:44.603	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=407883
163	Monkey Bridge - Cuong Rung Farm	Monkey Bridge – Cuong Rung Farm is a rustic countryside attraction near Phong Nha that offers visitors a taste of rural Vietnamese life. The highlight is its traditional wooden “monkey bridge” crossing a calm river, perfect for photos and a bit of fun. The farm also features gardens, animals, and peaceful walking paths, making it a relaxing stop for families and nature lovers. It’s a great place to enjoy fresh air, try local food, and see authentic village life up close.	17.58603290	106.34810380	Bồng Lai, Bố Trạch District, Quảng Bình	+84969013681	\N	\N	\N	/images/explore/monkeybridge1.jpg	{/images/explore/monkeybridge2.jpg}	\N	{}	\N	{}	none	\N	\N	f	\N	4.90	1032	\N	https://maps.app.goo.gl/JN1JgZTERnShMxaG8	t	t	t	f	2025-07-30 02:55:34.126135	2025-08-04 00:54:02.999	\N	\N
157	Dark Cave	Dark Cave – Hang Tối is an exhilarating cave adventure located within Phong Nha–Kẻ Bàng National Park. This natural attraction spans over 5 km and includes both dry sections and an underground river that empties into the Chày River. Visitors start the day with a thrilling zipline across the river into the cave entrance, followed by exploring narrow, unlit passages with a headlamp, and floating through deep chocolate‑colored mud pools where you naturally float without sinking. The excursion typically ends with kayaking back across the peaceful river and riverbank jungle scenery. With its mix of caving, mud baths, zip-lining, and kayaking, Dark Cave is one of the most adventurous—and fun—day trips in the region.	17.57446154	106.25141330	Sơn Trạch, Bố Trạch District, Quảng Bình, Vietnam	\N	\N	https://phongnhatourism.com.vn/	\N	/images/explore/DarkCave.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.30	96	\N	https://maps.app.goo.gl/38cHoYsuMvu8ViWt9	t	f	t	f	2025-07-30 02:55:25.946583	2025-08-04 02:32:38.938	\N	\N
144	Sea Star Resort Quang Binh	Sea Star Resort Quảng Bình is a relaxed beachfront retreat located on Quang Phú – Nhật Lệ Beach, just a short drive from Đồng Hới city center and the airport. The resort offers modern bungalows and guest rooms, many with ocean or garden views, equipped with air‑conditioning, private balconies, and comfortable amenities. Guests can enjoy multiple outdoor swimming pools, a private sandy beach with loungers, and on‑site dining with fresh seafood and local dishes. With its family‑friendly atmosphere, scenic seaside setting, and easy access to Phong Nha, it’s a great choice for combining beach relaxation with adventure.	17.52984878	106.59696340	Nhân Trạch, Bố Trạch District, Quảng Bình 510000, Vietnam	\N	\N	http://www.seastarresort.vn/	\N	/images/explore/SeaStar.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.00	841	\N	https://maps.app.goo.gl/iqDbRUVm1wquUJL68	t	f	t	f	2025-07-30 02:53:58.414465	2025-08-04 04:52:55.39	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=4913147
151	Thai Hoang Villa	Thai Hoàng Villa Quảng Bình is a modern beachside villa-style accommodation located just a few minutes’ walk from Nhật Lệ Beach in Đồng Hới. The spacious property offers 2–6 bedroom units, each equipped with air-conditioning, minibar, private bathroom, and balconies or terraces ideal for relaxing. Shared amenities include a garden lounge, rooftop terrace, BBQ area, and a communal kitchen perfect for casual meals or gatherings. With a tranquil seaside setting, modern comforts, and helpful staff—plus easy access to biking, hiking, the beach, and city attractions—it’s an excellent choice for groups or families seeking both convenience and serenity.	17.45412565	106.64546040	OTM 15.2, KĐT, Bảo Ninh, Đồng Hới, Quảng Bình 510000, Vietnam	\N	\N	\N	\N	/images/explore/ThaiHoang.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	5.00	35	\N	https://maps.app.goo.gl/8vHr4C2HrvxpGQ2F8	t	f	t	f	2025-07-30 02:54:00.056288	2025-08-04 04:58:36.209	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=72812625
170	Wildlife and Jungle Adventure - ECOFOOT	Wildlife and Jungle Adventure – ECOFOOT offers an immersive eco‑tour deep inside Phong Nha–Kẻ Bàng National Park, designed for nature lovers and conservation enthusiasts. The experience begins with a visit to a wildlife rescue center, where guests can learn about local conservation efforts and see rehabilitated animals. A guided jungle trek follows, taking participants through pristine rainforest, past streams, and into areas where langurs, hornbills, and other wildlife may be spotted. The day includes a freshly prepared BBQ lunch by a waterfall before returning through the lush forest, making it a memorable and educational adventure in the heart of the park.	17.60997890	106.31036900	Phong NHA, Bố Trạch District, Quảng Bình 510000	+84962606844	\N	https://ecofoot.com.vn/	\N	/images/explore/Wildlife.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	49	\N	https://maps.app.goo.gl/EK8EyFRk4b6WW5UP8	t	f	t	f	2025-07-30 02:55:46.579597	2025-08-04 05:09:38.665	\N	\N
76	5 ELEMENTS	5 Elements is a stylish riverside bar and restaurant in Phong Nha, known for its relaxed vibe and stunning sunset views. The menu blends Vietnamese and international flavors, offering everything from fresh spring rolls to wood‑fired pizzas. Guests can sip on craft cocktails or local beers while enjoying the tranquil river setting. With friendly service and a cozy atmosphere, it’s a perfect spot to unwind after a day exploring caves and countryside.	17.62157670	106.36823720	J9C9+J7Q, Hưng Trạch, Bố Trạch, Quảng Bình	\N	\N	\N	\N	https://lh3.googleusercontent.com/gps-cs-s/AC9h4noaFs11Ap-AzSEpsqYEPunekdbJPCSUct765PnWTSUzDiAm3hgycI5hC9Qg-CoSlD5iJrpLFe3hftH9CJbEYL56LLCMtVzOHItO81_H6qJi27MaGBfwulXjRSPmlFc8MZYfqEZgmQ=w1920-h1080-k-no	{https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrmkHmAmixDKd4mcH31ubnX17m6j6mBaN1Ccs72rlCBs7CrQh1JY4-6eyysnSPuICKAKaYIGWVCGqjCnSuJFaKsR66LcquJP2pSDyyHTNyXI-aCSnW4rUCp6p_cUVOg5_-kCTWBtw=w1920-h1080-k-no}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	3	\N	https://maps.app.goo.gl/j2U7r2EuzuPg7M5C7	f	f	f	f	2025-07-30 02:53:42.388488	2025-07-30 03:14:16.895	\N	\N
88	Celina Peninsula Resort- Resort đẹp Quảng Bình	Celina Peninsula Resort sits on the beautiful Bao Ninh Peninsula, surrounded by the East Sea on one side and the peaceful Nhat Le River on the other. This upscale beachfront resort offers spacious rooms and bungalows, many with views of the ocean, pool, or lush gardens. Guests can enjoy a private beach, two outdoor pools, a spa, sauna, fitness center, and activities like cycling, tennis, and yoga. With excellent dining, family‑friendly facilities, and a location just a few minutes from Dong Hoi, it’s the perfect base for combining Phong Nha exploration with a relaxing beach escape.	17.46043380	106.64465970	Võ Nguyên Giáp	+842323900999	\N	http://celinaresort.com/	\N	/images/explore/celine.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.50	919	\N	https://maps.app.goo.gl/6dpHaHMBqA5cqDJa7	t	f	t	f	2025-07-30 02:53:45.262882	2025-08-04 02:24:47.943	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=30717034
102	Green Riverside Cosy Home	Green Riverside Cosy Home is a tranquil riverside guesthouse nestled in Sơn Trạch, offering peaceful views of the Sông Son and surrounding limestone hills. Bright and comfortable private rooms and dorms often feature balconies or terraces overlooking gardens, river, or verdant landscape. Guests can relax at the outdoor terrace by a fireplace or dine on local dishes beneath shady trees, with free Wi‑Fi, bike rentals, and warm local hospitality. A serene, well-located base for both rest and exploration of Phong Nha’s caves and countryside.	17.60320162	106.29827360	ĐT20, Sơn Trạch, Bố Trạch, Quảng Bình 311860, Vietnam	+84778508898	\N	http://www.greenriverphongnha.com/	\N	/images/explore/GreenRiverside.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	771	\N	https://maps.app.goo.gl/ynR9fKRqssJkoQk27	t	f	t	f	2025-07-30 02:53:48.55326	2025-08-04 02:44:38.203	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=5859479
103	Greenfield Ecostay	Greenfield Ecostay is a serene, eco-friendly homestay set in vibrant green rice fields just a few kilometers outside Phong Nha town. This small retreat, managed by a Belgian–Vietnamese couple, features just ten rooms and cozy bungalows surrounded by flowering gardens and mountain views. A standout is the infinity pool overlooking the countryside, inviting guests to unwind in absolute peace. Guests enjoy home-cooked meals using organic produce, free bike and scooter rentals, and warm hospitality that makes it feel like a countryside home.	17.62202770	106.35285820	Hưng Trạch, Bố Trạch District, Quảng Bình	+84348402300	\N	https://greenfieldecostayphongnha.com/	\N	/images/explore/Greenfield.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	5.00	117	\N	https://maps.app.goo.gl/f4JSX7k7zqLNZCkc7	t	f	t	f	2025-07-30 02:53:48.787057	2025-08-04 02:45:38.629	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=5812992
106	Hưng Phát Bungalow	Hưng Phát Bungalow is a peaceful retreat set among rice paddies and karst mountains just a few kilometers from Phong Nha town. The property offers cozy bungalows and family rooms with air‑conditioning, private bathrooms, and balconies overlooking the pool or garden. Guests can relax by the outdoor pool, enjoy the quiet countryside, and make use of free bicycles to explore the area. Friendly hosts, fresh breakfasts, and a tranquil setting make it an excellent base for discovering the caves and nature of Phong Nha.	17.61702800	106.32348180	Thôn, Cù Lạc 1, Bố Trạch, Quảng Bình	+84393514028	\N	https://xn--hng-pht-mwa17p.bedsandhotels.com/	\N	/images/explore/HungPhat.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.90	195	\N	https://maps.app.goo.gl/RhSJW1kTHXf5H2hu5	t	f	t	f	2025-07-30 02:53:49.489965	2025-08-04 02:58:32.955	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=6377771
109	Lena Homestay & Villa	Lena Homestay & Villa is a stylish, family-run property in the Đồng Mỹ area of Đồng Hới, within a pleasant 10‑minute walk to Nhật Lệ Beach. The tastefully decorated rooms—including garden‑view twins and deluxe doubles—are spotlessly clean, spacious, and well-maintained, with air-conditioning, private bathrooms, and thoughtful amenities. Guests appreciate the quiet and leafy location, friendly hosts offering practical help like tour and transport tips, and easy access to café-lined streets and riverside promenades. With excellent value, personalized hospitality, and a convenient location, it’s a top choice for travelers seeking a peaceful yet accessible stay.	17.47728522	106.62168770	110 Dương Văn An, Đồng Mỹ, Đồng Hới, Quảng Bình, Vietnam	+84858515403	\N	\N	\N	/images/explore/Lena.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.60	33	\N	https://maps.app.goo.gl/tVfPVWAnokRAuXcL7	t	f	t	f	2025-07-30 02:53:50.196795	2025-08-04 03:04:37.693	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=38149130
117	Nam Long Plus hotel	Nam Long Plus Hotel is a friendly, family-run hotel in Đồng Hới, just a short walk from the Nhật Lệ River, the beach, and the city center. The hotel offers comfortable, air‑conditioned rooms with views of the city, river, or sea. Guests can enjoy free Wi‑Fi, parking, and bike rentals, as well as helpful services for booking tours to Phong Nha and other attractions. With its central location and warm hospitality, it’s a convenient and budget‑friendly choice for travelers.	17.47830810	106.62313990	28A Phan Chu Trinh	+84918923595	\N	\N	\N	/images/explore/NamLong.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.50	339	\N	https://maps.app.goo.gl/hJvcwVds3q1XhFeY6	t	f	t	f	2025-07-30 02:53:52.073089	2025-08-04 03:16:01.048	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=546528
122	Nguyen Shack Retreat	Nestled on a peaceful lake at the edge of the forest near Phong Nha, Nguyen Shack Retreat offers a tranquil escape in rustic private bungalows surrounded by nature. Yoga and meditation classes overlook serene water views and wooded hills, making it an ideal retreat for mindfulness and recharging. Guests enjoy an outdoor pool, bicycle rentals, and locally-inspired Asian meals served on-site, all with warm, attentive service. Located just a short drive from Phong Nha's famous caves, this retreat blends natural beauty, thoughtful design, and a relaxed rural atmosphere.	17.60062300	106.32888530	Cù Lạc 2, Bố Trạch District, Quảng Bình 511862	+84966551103	\N	http://nguyenshack.com/	\N	/images/explore/NguyenShack.jpeg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	431	\N	https://maps.app.goo.gl/dQbfps8fhVzewxEW9	t	f	t	f	2025-07-30 02:53:53.242481	2025-08-04 04:23:06.987	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=46063426
79	Aumori Hostel	Aumori Hostel is a charming, family-run guesthouse perfectly situated along the Nhật Lệ River—just a short stroll from Đồng Hới’s walking street and city center. Visitors consistently praise its exceptional cleanliness, comfortable rooms, and welcoming host who often goes above and beyond, like offering early check-in and arranging scooter rentals. Guests appreciate free cold water, helpful local guidance for tours, and trusted transport services to Phong Nha or Hue. With its homely atmosphere and ideal location, it’s a reliable and friendly base for both relaxation and adventure.	17.47813787	106.62243800	Ngõ 34 Lê Quý Đôn, Đồng Hải, Đồng Hới, Quảng Bình, Vietnam	+84915780944	\N	\N	\N	/images/explore/aumori1.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.70	21	\N	https://maps.app.goo.gl/dk2kErc3C3AsAaDPA	t	f	t	f	2025-07-30 02:53:43.152106	2025-08-04 01:08:09.553	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=58312207
80	Balanha	Balanha is a modern beachfront guesthouse in Đồng Hới, conveniently located within an 8-minute walk of Nhật Lệ Beach. The property features comfortable rooms and family suites, many with balconies or garden views, offering air-conditioning and private bathrooms. Guests can relax by the seasonal outdoor pool, enjoy time in the garden or sun terrace, and take advantage of BBQ facilities on-site. With free amenities like fresh linens, toiletries, and utilities included, alongside friendly, helpful staff, it’s a relaxed and budget-friendly option for beachside stays.	17.47744740	106.63112520	26 Nguyễn Thị Định, Bảo Ninh, Đồng Hới, Quảng Bình 47121, Vietnam	+84987090209	\N	\N	\N	/images/explore/balanha1.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.90	121	\N	https://maps.app.goo.gl/MAJgGc1HfNDhNcd18	t	f	t	f	2025-07-30 02:53:43.38651	2025-08-04 02:12:52.781	\N	\N
81	Bamboo's House	Bamboo’s House is a warm, budget‑friendly homestay located in Đồng Hới, just steps from the tranquil Nhật Lệ Beach. Guests enjoy a cozy rooftop terrace with a laid‑back bar vibe, BBQ facilities, and relaxed areas where travelers meet over chilled drinks and local conversation. The attentive, friendly staff—including the welcoming owner—offer personalized service, bike or scooter rentals, and help arranging tours or beach trips. Clean, comfortable rooms, fast Wi‑Fi, and included breakfast with generous portions make it a top pick for a fuss‑free stay while exploring Phong Nha’s caves and countryside.	17.48844580	106.62721260	143 Trương Pháp	+84933270726	\N	\N	\N	/images/explore/bamboo1.jpg	{}	\N	{budget}	\N	{}	affiliate	\N	\N	f	\N	3.90	146	\N	https://maps.app.goo.gl/aNrsjcCQ9J1Fr83c6	t	f	t	f	2025-07-30 02:53:43.621312	2025-08-04 02:14:14.085	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=15313324
78	Amanda Hotel Quảng Bình	Amanda Hotel Quảng Bình is a modern 12‑storey hotel located in the Bảo Ninh area of Đồng Hới, just a short walk from Nhật Lệ Beach and close to the city center. The hotel offers spacious, well‑appointed rooms with air‑conditioning, private bathrooms, and large windows or balconies with views of the river, beach, or city. Guests can enjoy on‑site dining with Vietnamese and international cuisine, relax in the garden terrace or café lounge, and make use of the tour desk for organizing local excursions. With its convenient location, comfortable rooms, and friendly service, it’s a great mid‑range choice for travelers exploring Quảng Bình.	17.47394223	106.63126220	Trần Hưng Đạo, Bảo Ninh, Đồng Hới, Quảng Bình 510000, Vietnam	+84981707999	\N	http://amandaquangbinh.com/	\N	/images/explore/amandahotel1.jpg	{/images/explore/amandahotel2.jpg}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.10	88	\N	https://maps.app.goo.gl/Y2XyECHX9L8APQkH6	t	f	t	f	2025-07-30 02:53:42.917828	2025-08-04 01:04:44.782	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=2023915
77	A Trần - cơm gà xối mỡ	A Trần – Cơm Gà Xối Mỡ is a popular spot in Đồng Hới, well‑known for its crispy fried chicken served over fragrant rice cooked in rich chicken broth. The chicken skin is golden and crunchy, while the meat stays tender and juicy. The dish is paired with fresh vegetables and a flavorful garlic‑chili sauce that adds a delicious kick. With generous portions, quick service, and affordable prices, it’s a favorite stop for both locals and travelers craving authentic, comforting Vietnamese flavors.	17.46502314	106.62544930	9 Lê Trực, Đồng Hải, Đồng Hới, Quảng Bình, Vietnam	+84941710888	\N	\N	\N	/images/explore/ATran1.jpg	{/images/explore/ATran2.jpg}	\N	{}	\N	{}	none	\N	\N	f	\N	3.80	148	\N	https://maps.app.goo.gl/Tp6xvYL9Wz7kGTBC6	t	f	t	f	2025-07-30 02:53:42.683826	2025-08-04 02:11:35.373	\N	\N
86	Bún bò Huế (KINH THÀNH)	Bún bò Huế (Kinh Thành) is a local eatery in Đồng Hới celebrated for its richly flavored bowl of bún bò Huế made in the style of Huế. The broth is deeply savory with fragrant lemongrass and shrimp paste, paired with thick vermicelli noodles, tender beef, blood jelly, and pork knuckles, finished with herbs, banana blossom, and a squeeze of lime. This spot delivers a genuine Hue-style experience right in Quảng Bình, perfect for breakfast or a hearty midday meal. Expect a bustling, friendly vibe with locals gathering for this well-loved regional specialty.	17.61107970	106.30728900	J864+CWM	+84775359035	\N	\N	\N	/images/explore/BunboHue1.jpg	{/images/explore/BunboHue2.jpg}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	13	\N	https://maps.app.goo.gl/8ge7977sCvK6R9nr6	t	f	t	f	2025-07-30 02:53:44.792624	2025-08-04 02:22:17.759	\N	\N
85	BinBin Homestay Đồng Hới Quảng Bình	BinBin Homestay is a cozy and well‑rated guesthouse located just over a minute’s walk from Nhật Lệ Beach in Đồng Hới, making it an easy base for both beach days and airport transfers. Each guest room is bright, clean, and air-conditioned, with essentials such as a flat-screen TV, fridge, private bathroom, and free parking. The family‑friendly atmosphere, welcoming hosts, and services like bicycle use or golf‑buggy pick‑up add a lovely local touch. Rated highly for cleanliness, comfort, value, and helpful service, it’s a favorite among travelers exploring Quảng Bình.	17.50682640	106.61482540	240 Nguyễn Hữu Hào	+84941375586	\N	\N	\N	/images/explore/BinBin1.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.40	21	\N	https://maps.app.goo.gl/HNiPhsRfWDiGY4nXA	t	f	t	f	2025-07-30 02:53:44.55876	2025-08-04 02:17:28.088	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=67851517
87	Casual beer restaurant	Quán Nhậu 75 (Phú Trọng Quán) is a popular casual beer restaurant located at number 75 Bạch Đằng Street in Đồng Hới. It’s known for its budget-friendly, laid-back setting—ideal for enjoying cold drinks and hearty shared plates with friends or families. The menu features a variety of grilled meats, fresh seafood, and local favorites prepared simply and deliciously. With generous portions, friendly service, and a lively local feel, it’s a favorite spot to unwind after sightseeing or a day of exploring.	17.59330936	106.25779500	H7V5+64C, Phúc Trạch, Bố Trạch, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/Casualbeer.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	3.30	3	\N	https://maps.app.goo.gl/6WShGkuCxnvJj2zu5	t	f	t	f	2025-07-30 02:53:45.028183	2025-08-04 02:23:42.957	\N	\N
95	Dozy Hostel	Dozy Hostel is a modern, capsule‑style hostel in Đồng Hới, just a short walk from Nhật Lệ River and the city center. It offers clean and comfortable capsule beds as well as private rooms, all designed with a focus on simplicity and efficiency. Guests appreciate the friendly staff, motorbike rental service, and help with arranging tours to Phong Nha. With its convenient location and relaxed atmosphere, it’s a great budget‑friendly choice for travelers.	17.47551651	106.62203490	29 Dương Văn An, Đồng Hải, Đồng Hới, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/dozy.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.40	27	\N	https://maps.app.goo.gl/giCAX1DrJKhqBHep8	t	f	t	f	2025-07-30 02:53:46.901276	2025-08-04 02:35:12.265	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=1194083
82	Bánh khoái Tứ Quý	Bánh Khoái Tứ Quý is a local favorite in Đồng Hới, famous for its golden, crispy pancakes stuffed with shrimp, pork, and bean sprouts. Served with fresh herbs, green banana, and starfruit, each bite bursts with flavor. The rich dipping sauce, made from peanuts and liver, is the perfect balance of sweet, savory, and tangy. The relaxed, welcoming atmosphere makes it a must‑try for anyone exploring Quảng Bình’s culinary scene.	17.46464400	106.62683760	17 Cô Tám	+842323821371	\N	https://www.foody.vn/quang-binh/banh-khoai-tu-quy	\N	/images/explore/Banhkhoai1.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.00	512	\N	https://maps.app.goo.gl/xc2UZWY8e8giuyTx8	t	f	t	f	2025-07-30 02:53:43.855826	2025-08-04 02:19:44.414	\N	\N
84	BEE PUB - PHONG NHA	Bee Pub is a lively and welcoming bar in the center of Phong Nha, perfect for relaxing after a day of adventure. The pub features great cocktails, cold beers, and a fun selection of games like pool, foosball, and darts. With its neon-lit vibe, good music, and friendly atmosphere, it’s a favorite spot for travelers to meet, mingle, and enjoy a vibrant night out in town.	17.61038870	106.30958410	ĐT20, Phong NHA, Bố Trạch, Quảng Bình	\N	\N	https://bee-hive-adventures.lovable.app/	\N	/images/explore/beepub1.jpg	{/images/explore/beepub2.jpg}	\N	{backpackers,beer}	\N	{}	none	\N	\N	f	\N	5.00	324	\N	https://maps.app.goo.gl/vTrkFWqFm7TTYvTX7	t	f	t	f	2025-07-30 02:53:44.32458	2025-08-04 01:08:57.176	\N	\N
90	Chày Lập Farmstay	Relaxed bungalows offering free Wi-Fi, plus an outdoor pool, bike rentals & a restaurant & a bar.	17.60172770	106.25461760	\N	+84931357677	\N	https://chaylapfarmstay.com/	\N	/images/explore/chaylap.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.40	696	\N	https://maps.app.goo.gl/cDKz7X9xM61qPcjX7	t	f	t	f	2025-07-30 02:53:45.731815	2025-08-04 02:26:52.273	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=55664261
92	Cối Xay Gió Homestay Quảng Bình	Cối Xay Gió Homestay is a peaceful and charming getaway in Đồng Hới, just a short walk from Nhật Lệ Beach. The homestay offers bright, comfortable rooms ranging from dorms to private family suites, all equipped with air-conditioning and clean bathrooms. Guests can relax in the garden, enjoy the shared kitchen, or unwind with a coffee in the lounge. Friendly hosts, bike rentals, and a welcoming atmosphere make it a great base for exploring Phong Nha and the surrounding area.	17.46036500	106.63842420	Trung Bính, Dong Hoi, Quảng Bình 47000	+84905959388	\N	https://www.facebook.com/coixaygiohomestaycoffee.quangbinh	\N	/images/explore/CoiXay.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.40	21	\N	https://maps.app.goo.gl/XsEiA3KDTttDkEgU7	t	f	t	f	2025-07-30 02:53:46.199195	2025-08-04 02:30:16.149	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=5846471
94	Dolphin Homestay	Dolphin Homestay is a warm and welcoming guesthouse located on Nguyễn Du Street in Đồng Hới, right on the banks of the scenic Nhật Lệ River. Just minutes from the town center and close to the beach, it features six cozy rooms (including doubles, family, and dorm-style), and guests can enjoy a rooftop terrace with river views, as well as elegant pastel decor throughout.	17.47664160	106.62340090	42 Nguyễn Du	+84985668563	\N	http://dolphinhomeqb.com/	\N	/images/explore/DolphinHomestay.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	314	\N	https://maps.app.goo.gl/gyExYVLJM4iS8yKE8	t	f	t	f	2025-07-30 02:53:46.668223	2025-08-04 02:33:55.719	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=63536486
89	Central Backpackers Hostel - Phong Nha	Central Backpackers Hostel – Phong Nha is a lively, social hostel just outside the town center, perfectly placed for exploring the national park and nearby attractions. It offers a fun atmosphere with a pool, garden, bar, and common spaces ideal for meeting other travelers. Accommodation includes clean dorms and private rooms, all with air‑conditioning and comfortable beds. With friendly staff, free breakfast, and regular events like BBQ nights and happy hours, it’s a top choice for budget travelers seeking both adventure and community.	17.60912210	106.31329200	Xuân Tiến, Phong NHA, Bố Trạch, Quảng Bình 470000	+842326536868	\N	https://centralbackpackersphongnha.com/	\N	/images/explore/centralbp.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.50	451	\N	https://maps.app.goo.gl/T2Q1Z3HiuxtFNRGq6	t	f	t	f	2025-07-30 02:53:45.497598	2025-08-04 02:25:46.022	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=7427814
91	Coffee Lyly 89	Coffee Lyly 89 is a stylish and cozy café located in the heart of Phong Nha town, perfect for relaxing with a drink between adventures. The interior feels warm and inviting, while outdoor seating offers a pleasant spot to enjoy fresh air and local surroundings. Their menu includes a variety of aromatic coffees, teas, and refreshing beverages, all served in a friendly and welcoming atmosphere. Whether you're seeking a quiet morning start or a peaceful afternoon break, this café is a delightful place to unwind and recharge.	17.58191140	106.25475290	Thôn chày lập, Phúc Trạch, Bố Trạch, Quảng Bình	\N	\N	\N	\N	/images/explore/CoffeeLyly.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	82	\N	https://maps.app.goo.gl/YKLEN3rFKMfrtZKF7	t	f	t	f	2025-07-30 02:53:45.966638	2025-08-04 02:28:56.076	\N	\N
93	Danh Lam Homestay(tân hoá.quảng bình)	Danh Lam Homestay is a charming community-style lodgings nestled in Tân Hóa village, about 70 km northwest of Phong Nha. Guests stay in thoughtfully designed homes—some built on stilts, others floating—to withstand seasonal flooding, offering both comfort and a unique cultural experience. Surrounded by limestone mountains, riverside views, and wide-open grasslands, the atmosphere is tranquil and immersive. Staying here gives you the chance to explore local culture firsthand, cycle through fields, paddle on the river, and connect with friendly people from the Nguồn community.	17.77134540	106.03938930	Thôn 1, Minh Hoá, Quảng Bình	+84916940643	\N	\N	\N	/images/explore/DanhLam.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	23	\N	https://maps.app.goo.gl/J2zXTzHvqwSBGwAD9	t	f	t	f	2025-07-30 02:53:46.433108	2025-08-04 02:31:37.99	\N	\N
143	Rumba	Rumba Restaurant & Bar is a stylish venue in Đồng Hới offering a refined dining and drinks experience with a relaxed atmosphere. The menu blends Vietnamese, Asian, and Western dishes, all prepared with fresh ingredients and creative presentation. Guests enjoy attentive service, a comfortable setting, and a welcoming ambiance that makes it a perfect place to unwind after a day of exploring.	17.46586260	106.62642920	FJ8G+6H3, Quách Xuân Kỳ, Đồng Hải, Đồng Hới, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/Rumba.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.20	6	\N	https://maps.app.goo.gl/NoJQYyvWHRYq1Y8A6	t	f	t	f	2025-07-30 02:53:58.181587	2025-08-04 04:51:05.346	\N	\N
97	East Hill - Phong Nha	East Hill – Phong Nha is a rustic open‑air café & casual restaurant perched on a gentle hillside just outside Phong Nha town. With lush green gardens and flower-filled terraces overlooking rice plains and hills, it’s a dreamy spot to pause and enjoy the sunset. Try their signature grilled chicken or other simple Vietnamese dishes while swinging on a hammock or relaxing on wooden decks. This peaceful, photo‑friendly venue offers a true rural escape and a serene break between cave adventures or countryside treks.	17.61804570	106.36472410	Cầu Bùng, Cà Phê đồi	+84948953925	\N	https://www.facebook.com/East-Hill-Phong-Nha-237868583268158	\N	/images/explore/easthill.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.50	296	\N	https://maps.app.goo.gl/ZYynUtLRqdT2vbnf7	t	f	t	f	2025-07-30 02:53:47.383542	2025-08-04 02:38:19.05	\N	\N
98	Fami Homestay	Fami Homestay is a welcoming, family-run guesthouse nestled in Sơn Trạch, about 2 km from Phong Nha town center and the visitor center. It offers a tranquil garden and terrace setting where guests can relax after a day of exploring local caves. Accommodation includes air-conditioned private rooms and dorm beds, with shared amenities such as free Wi‑Fi, a café, a small playground, and complimentary bicycle use. With friendly 24‑hour reception, pet‑friendly policies, and easy access to tours and transport, it's a comfortable and convenient choice for travelers wanting both value and local charm.	17.61653940	106.32156410	Cù Lạc 1, Bố Trạch District, Quảng Bình	+84942808823	\N	\N	\N	/images/explore/Fami.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.30	29	\N	https://maps.app.goo.gl/jqtGfrZhsaeiv8Ui6	t	f	t	f	2025-07-30 02:53:47.617228	2025-08-04 02:39:29.532	\N	\N
99	Geminai Restaurant	Geminai Restaurant is a vibrant Thai-style bistro situated along the peaceful riverside of Đồng Hới, offering guests a cozy and inviting dining experience. The menu features a creative fusion of authentic Thai flavors—including standout items like pineapple fried rice, spicy stir-fries, and a rich Thai hotpot—with a few Western-style dishes such as uniquely seasoned burgers. Known for warm hospitality and attentive service, it’s a favorite among locals and travelers alike. With clean, stylish interiors, relaxed outdoor seating, and fair prices, it’s a great choice for a flavorful meal after sightseeing in Đồng Hới.	17.47699500	106.62351610	56 Nguyễn Du	+842323938888	\N	\N	\N	/images/explore/Geminai.png	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.10	652	\N	https://maps.app.goo.gl/5zuBVFdqF9vbhYm2A	t	f	t	f	2025-07-30 02:53:47.851594	2025-08-04 02:40:28.734	\N	\N
100	Genkan Vegan Cafe	Genkan Vegan Cafe is a cozy plant‑based café tucked away on a quiet street in Đồng Hới. The menu features a variety of vegan and vegetarian dishes, from fresh salads and rice noodles to flavorful stir‑fried vegetables and tofu. The atmosphere is calm and inviting, with greenery and warm décor that make it a relaxing place to enjoy a meal. Friendly service and wholesome food make it a top choice for health‑conscious travelers visiting Quảng Bình.	17.47451510	106.62198240	Đường 56 Dương Văn An	+84989631186	\N	\N	\N	/images/explore/genkan.jpg	{}	\N	{vegan}	\N	{}	none	\N	\N	f	\N	4.60	93	\N	https://maps.app.goo.gl/3y4v9sKoiikNHutLA	t	f	t	f	2025-07-30 02:53:48.085212	2025-08-04 02:41:47.466	\N	\N
101	Gold Coast Hotel Resort & Spa	Gold Coast Hotel Resort & Spa is a luxurious beachfront escape on the Bao Ninh Peninsula, offering stunning views of the East Sea and Nhật Lệ River. The resort features spacious rooms, suites, and villas, many with private balconies overlooking the ocean or tropical gardens. Guests can enjoy a private beach, large swimming pools, a full-service spa, multiple restaurants, tennis courts, and a kids’ club. With excellent service, modern amenities, and a peaceful atmosphere, it’s an ideal choice for both relaxation and exploring Phong Nha.	17.46660760	106.64052380	Đường Võ Nguyên Giáp	+842326256666	\N	http://www.goldcoastquangbinh.com/	\N	/images/explore/GoldCoast.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.60	1577	\N	https://maps.app.goo.gl/KrCgqcScdfSsJ4Ro8	t	f	t	f	2025-07-30 02:53:48.319378	2025-08-04 02:43:02.876	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=2172456
104	Ha Linh Restaurant	Ha Linh Restaurant is a spacious, well‑ventilated dining spot located in Phúc Trạch (Bố Trạch District), serving a wide range of Vietnamese favorites including rice dishes (cơm), noodle soups, bún bò Huế, bún chả, and more . Its standout dish is roasted suckling pig, featuring crispy golden skin and tender, aromatic meat that impresses guests with both flavor and presentation .	17.58258000	106.25511640	H7J3+4P8, QL15, Phúc Trạch, Bố Trạch, Quảng Bình, Vietnam	+84915932400	\N	\N	\N	/images/explore/HaLinh.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	3.40	74	\N	https://maps.app.goo.gl/j4JcFGfuQd36pVAA8	t	f	t	f	2025-07-30 02:53:49.020638	2025-08-04 02:47:13.043	\N	\N
105	Hải Âu Hotel and Apartment	Hải Âu Hotel & Apartment is a comfortable, family‑run property located a short walk from Nhật Lệ Beach in Đồng Hới. The hotel offers air‑conditioned rooms with private bathrooms, flat‑screen TVs, and some with views of the river, garden, or surrounding neighborhood. Guests can enjoy free parking, 24‑hour reception, and helpful service that often includes local travel advice and tour arrangements. With clean rooms, friendly hospitality, and a convenient location, it’s a great value choice for travelers exploring Đồng Hới and Phong Nha.	17.47518380	106.63213170	Bảo Xuân, Dong Hoi, Quảng Bình	+84905095073	\N	\N	\N	/images/explore/HaiAu.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	3.50	87	\N	https://maps.app.goo.gl/U7aX9MdwgWsJxDAH7	t	f	t	f	2025-07-30 02:53:49.254858	2025-08-04 03:00:09.95	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=74631424
107	Karst Villas Phong Nha	Karst Villas Phong Nha is a boutique retreat set in a quiet village surrounded by rice paddies and dramatic karst mountains, just minutes from the national park. The property features modern villas and rooms, many with balconies or terraces offering sweeping countryside views. Guests can relax by the infinity‑style pool, enjoy the garden lounge, and dine at the on‑site restaurant and bar. With comfortable rooms, bike rentals, and warm hospitality, it’s an ideal base for exploring the caves and natural beauty of Phong Nha.	17.61058040	106.33625030	Unnamed Road, Bố Trạch, Quảng Bình	+84857788789	\N	\N	\N	/images/explore/KarstVillas.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.70	240	\N	https://maps.app.goo.gl/gdaUN6c5PVXfTJfU6	t	f	t	f	2025-07-30 02:53:49.723944	2025-08-04 03:02:33.893	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=28084550
108	Khách sạn Trung Trầm	Khách sạn Trung Trầm is a modern 4‑star hotel in Bảo Ninh, just a short walk from Nhật Lệ Beach and close to Đồng Hới city center. The hotel offers spacious, well‑appointed rooms with air‑conditioning, flat‑screen TVs, minibars, and private bathrooms, some with city views. Amenities include an indoor pool, shared lounge areas, and free parking, along with friendly, attentive service. With its convenient location and comfortable facilities, it’s a solid choice for travelers looking to combine beach relaxation with exploring Phong Nha.	17.45885170	106.64310750	27-29 Hoàng Đạo Thuý, Bảo Ninh, Đồng Hới, Quảng Bình, Vietnam	+84357370886	\N	\N	\N	/images/explore/Khachsan.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.70	28	\N	https://maps.app.goo.gl/MsvWXHcdjJgFAhcf8	t	f	t	f	2025-07-30 02:53:49.958263	2025-08-04 03:03:33.181	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=59675952
113	Melia Vinpearl Quảng Bình	Meliá Vinpearl Quảng Bình is a luxurious 5‑star hotel overlooking the Nhật Lệ River in the heart of Đồng Hới. Its prime location offers easy access to markets, city landmarks, and the beach, with the airport just a short drive away. The hotel features spacious rooms and suites with river or city views, modern amenities, and elegant decor. Guests can enjoy an indoor heated pool, spa, fitness center, and on‑site dining. With attentive service and premium facilities, it’s an ideal choice for both leisure and business travelers visiting Quảng Bình.	17.46592067	106.62653480	Quách Xuân Kỳ, Đồng Hải, Đồng Hới, Quảng Bình 47000, Vietnam	+842323900888	\N	https://www.melia.com/en/hotels/vietnam/quang-binh/melia-vinpearl-quang-binh?utm_campaign=google&utm_content=5766&utm_medium=organic&utm_source=directories	\N	/images/explore/Melia.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.90	2434	\N	https://maps.app.goo.gl/3kCX5m3QRiXkZBd5A	t	f	t	f	2025-07-30 02:53:51.136332	2025-08-04 03:10:26.461	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=5663774
115	Mộc Hoa Viên/Restaurant	Mộc Hoa Viên is a charming riverside restaurant in Đồng Hới, offering beautiful views of the Nhật Lệ River. The restaurant features a garden‑style setting with open-air seating, perfect for enjoying fresh air and river breezes. Specializing in seafood, the menu includes dishes like grilled squid, prawns, fish hotpot, and seasonal specialties prepared with local flavors. With its relaxing atmosphere and friendly service, it’s a popular choice for both locals and visitors looking for a scenic dining experience.	17.58236549	106.25512690	H7J4+V29 Moc Hoa Viên Chày Lập, Phúc Trạch, Bố Trạch, Quảng Bình, Vietnam	+84914882993	\N	\N	\N	/images/explore/MocHoa.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.90	61	\N	https://maps.app.goo.gl/UQREaYPyJynLrfw27	t	f	t	f	2025-07-30 02:53:51.604251	2025-08-04 03:13:26.167	\N	\N
110	Lotus Restaurant - Phong Nha	Lotus Restaurant is a scenic riverside dining spot just outside Phong Nha, surrounded by lush gardens and tranquil water views. The menu blends Vietnamese and Southeast Asian flavors, with specialties like banana flower salad, mango salad, cashew tofu, and bamboo‑tube chicken, all known for their freshness and colorful presentation. Guests praise the friendly, attentive service and the relaxing atmosphere, making it a favorite choice for a memorable meal in the area.	17.61910062	106.33805890	Cù Lạc 1, Bố Trạch District, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/Lotus.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	392	\N	https://maps.app.goo.gl/c3Zw3fKcRrQsn9Ky8	t	f	t	f	2025-07-30 02:53:50.435169	2025-08-04 03:08:12.247	\N	\N
114	Mia's House	Mia’s House is a charming and cozy homestay nestled in Bảo Ninh, just a short distance from downtown Đồng Hới and Nhật Lệ Beach. The property features three well-appointed bedrooms—with options including double, twin, or dorm—comfortable for up to 12 guests. Free Wi‑Fi, air-conditioning, daily housekeeping, and a tranquil garden with BBQ facilities add a homely and welcoming feel. Visitors often praise the friendly hosts, thoughtful touches like snack bar service, shuttle options, pet-friendliness, and its peaceful yet convenient location for both beach days and exploring Phong Nha.	17.47236430	106.63240950	91 Nguyễn Thị Định, Đồng Dương, Đồng Hới, Quảng Bình 510000	\N	\N	\N	\N	/images/explore/Mia.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.50	8	\N	https://maps.app.goo.gl/MSZBnjCqFXc7Ediv5	t	f	t	f	2025-07-30 02:53:51.370308	2025-08-04 03:11:24.427	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=16217457
112	Mê Công Cafe	The family running this place are wonderful. Excellent spot for lunch and dinner. Perfect river/mountain view for sunset. Easy 5min motorcycle ride from the main street.	17.61958439	106.34596250	J89W+QC2, Unnamed Road, Hưng Trạch, Bố Trạch, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/mekong.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.90	26	\N	https://maps.app.goo.gl/tQVjURPEohpSpkQQ6	t	f	t	f	2025-07-30 02:53:50.902934	2025-08-04 03:12:25.063	\N	\N
119	Nem Lụi - Bún Thịt Nướng LyLy 1	Nem Lụi – Bún Thịt Nướng LyLy 1 is a popular local eatery in Đồng Hới, known for its delicious grilled pork dishes. Their bún thịt nướng features tender grilled pork served over fresh vermicelli noodles with herbs, peanuts, and a flavorful dipping sauce. The signature nem lụi—pork skewers grilled over charcoal—offers a smoky, fragrant taste that’s perfect for sharing. With generous portions, quick service, and a lively local atmosphere, it’s a must‑try for visitors wanting authentic Quảng Bình flavors.	17.47060780	106.61700770	124 Đường Hai Bà Trưng	+84911027373	\N	\N	\N	/images/explore/NemLui.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.40	33	\N	https://maps.app.goo.gl/PJjNKw3wgVjoz2xT8	t	f	t	f	2025-07-30 02:53:52.542012	2025-08-04 04:19:51.478	\N	\N
116	Mộc Nhiên Quán	Mộc Nhiên Quán is a serene vegetarian restaurant set amid lush greenery on the outskirts of Phong Nha, offering peaceful ambiance and wholesome local cuisine. The menu features traditional vegetarian dishes such as sour rib hotpot, fermented crab noodle soup, tamarind-pickled beef salad, and garlic-flamed eggs—each prepared with distinctive Vietnamese flavors. It’s ideal for visitors seeking light yet flavorful meals in a relaxed, natural setting with capacity for groups and private gatherings. The atmosphere is calm and welcoming, making it a great choice for enjoying healthy, authentic cuisine away from the bustle.	17.64345740	106.26215120	thôn 1, Bố Trạch District, Quảng Bình	+84818952281	\N	\N	\N	/images/explore/MocNhien.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.60	29	\N	https://maps.app.goo.gl/ujJ1SiZbi3zatHUE7	t	f	t	f	2025-07-30 02:53:51.838519	2025-08-04 03:14:46.601	\N	\N
120	New Beach - OVAN	New Beach – OVAN is a relaxed beachfront guesthouse in Đồng Hới, offering direct access to a long, quiet stretch of sand just a few minutes’ walk from Nhật Lệ Beach. The property features simple but comfortable rooms and family suites with air conditioning and private bathrooms, many with garden or sea views. Guests can enjoy a small sun terrace, beachside lounging, and a peaceful garden setting. With free parking, friendly service, and a convenient location close to the river and downtown, it’s a great low‑key option for those looking to unwind near the coast or travel onward to Phong Nha.	17.50251940	106.61699200	18 Nguyễn Hoàng	+84966709333	\N	https://www.ngoinhakhoedep.vn/newbeach	\N	/images/explore/NewBeach.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.00	1	\N	https://maps.app.goo.gl/3r1mownmunAabHTR9	t	f	t	f	2025-07-30 02:53:52.775893	2025-08-04 04:21:04.212	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=71446777
121	Newlife Homestay( thiện tâm homestay)	NewLife Homestay (Thiện Tâm Homestay) is a vibrant yellow-and-red Hoi An–inspired retreat situated right on Trương Pháp Street, just steps from Nhật Lệ Beach. The homestay features modern, air‑conditioned rooms including double, family, and triple layouts, many offering garden or beachfront views. Guests can enjoy a small outdoor restaurant and terrace overlooking the sea, and evening BBQ options in a relaxed, friendly setting. With free Wi‑Fi, complimentary parking, helpful hosts, and organized bike/moped rentals, it’s an inviting and convenient choice for travelers seeking a beachside stay with local charm.	17.49958650	106.62232920	Trương Pháp, Bắc Lý, Đồng Hới, Quảng Bình	+84338720228	\N	\N	\N	/images/explore/Newlife.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.10	51	\N	https://maps.app.goo.gl/fyfXAYa7s5X7pUfc8	t	f	t	f	2025-07-30 02:53:53.009332	2025-08-04 04:22:08.843	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=61734849
127	Nhà Hàng Ngà Danh	Nhà Hàng Ngà Danh is a cozy family-style restaurant tucked away in a riverside hamlet just a few kilometers from Phong Nha town. The menu features a variety of Vietnamese comfort dishes—like clay-pot fish, spicy tamarind soup, and fresh noodle bowls—plus seasonal seafood specialties caught locally. With garden seating shaded by bamboo and lanterns, generous portions, and friendly local service, it offers an inviting and authentic culinary experience. Ideal for travelers seeking traditional flavors in a peaceful, village atmosphere.	17.77726451	106.00468170	Thôn, Kim Bảng, Minh Hóa, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/NhaHangNga.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	2	\N	https://maps.app.goo.gl/qDbrgzAFRCqXFv1X9	t	f	t	f	2025-07-30 02:53:54.428843	2025-08-04 04:24:28.17	\N	\N
128	Nhà Hàng Phương Nam II	Nhà Hàng Phương Nam II is a popular family-style restaurant located in Đồng Hới, offering a warm and casual dining experience. The menu highlights central Vietnamese cuisine, featuring specialties such as grilled seafood, flavorful noodle soups, rice plates, and fresh salads. Known for generous portions, fair prices, and attentive service, it’s a trusted spot among locals and visitors alike. With indoor and outdoor seating and a welcoming atmosphere, it makes for a satisfying stop either before heading out to explore or for winding down after a day’s adventure.	17.57790940	106.25425720	Hang Tối Chày Lập	+84915519819	\N	https://www.facebook.com/NhaHangPhuongNam2	\N	/images/explore/NhaHangPhuong.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	3.90	365	\N	https://maps.app.goo.gl/X2jkk5ewmtJoCU1N8	t	f	t	f	2025-07-30 02:53:54.663049	2025-08-04 04:25:56.018	\N	\N
123	Nhà hàng Bình Thiên Đường	Nhà hàng Động Thiên Đường sits just outside the entrance to Paradise Cave in Phong Nha–Kẻ Bàng National Park. It offers a spacious, rustic dining setting surrounded by lush forest views—perfect for enjoying a meal after cave exploration. The menu features hearty Vietnamese dishes inspired by local flavors, including grilled meats, fresh vegetables, and regional specialties. With accommodating service and proximity to the cave site, it’s a convenient—and satisfying—stop for travelers exploring the area.	17.58142080	106.25459960	Đường Hồ Chí Minh - Nhánh Tây	+84917127444	\N	https://www.facebook.com/bop.binh.547	\N	/images/explore/NhahangBinh .jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	8	\N	https://maps.app.goo.gl/Ah6maPk5F97u8J7u6	t	f	t	f	2025-07-30 02:53:53.478363	2025-08-04 04:28:38.076	\N	\N
124	Nhà hàng Chang My	Nhà hàng Chang My is a friendly, family-run restaurant in Phong Nha, known for its generous portions and home‑style Vietnamese cooking. Open throughout the day, it serves a variety of regional dishes including rice plates, noodle soups, and grilled meats. The casual setting and welcoming service make it a comfortable stop for both locals and travelers looking for a hearty, authentic meal.	17.57912180	106.25440420	H7H3+JQR, Hồ Chí Minh Tây	+84917065171	\N	\N	\N	/images/explore/NhahangChang.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	3.80	33	\N	https://maps.app.goo.gl/huWKdnjNEkxFzjnC6	t	f	t	f	2025-07-30 02:53:53.725745	2025-08-04 04:30:04.181	\N	\N
125	Nhà hàng Khánh Thuỷ	Nhà hàng Khánh Thủy is a friendly, family‑run restaurant located in Sơn Trạch, close to many of Phong Nha’s main attractions. The menu features fresh, locally sourced ingredients with standout dishes such as river fish, grilled meats, and seasonal vegetables. Known for its warm hospitality and relaxed setting, it’s a popular stop for both locals and travelers. Its convenient location makes it an ideal place to enjoy a hearty meal after exploring the caves or countryside.	17.58825820	106.25876850	QL15, thôn Chày, Bố Trạch, Quảng Bình 510000	+84818320999	\N	\N	\N	/images/explore/NhahangKhanh.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.10	122	\N	https://maps.app.goo.gl/waw3zKr3SWwyw2sS7	t	f	t	f	2025-07-30 02:53:53.960653	2025-08-04 04:31:23.983	\N	\N
126	Nhà hàng Mộc Hoa Viên	Nhà hàng Mộc Hoa Viên is a riverside seafood restaurant in Đồng Hới, offering scenic views over the sparkling Nhật Lệ River. The setting evokes traditional Vietnamese charm with garden-like décor, clay‑roofed structures, and open terraces. The menu centers on fresh seafood—such as live squid, grilled shrimp, fish hotpots, and salt‑and‑chili prawns—prepared with local flavors and seasonal ingredients	17.45250880	106.63869620	FJ3Q+2F4, Hà Thôn, Đồng Hới, Quảng Bình	\N	\N	\N	\N	/images/explore/NhahangMoc.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.60	27	\N	https://maps.app.goo.gl/PXr7oXQns7ZWGREV7	t	f	t	f	2025-07-30 02:53:54.195308	2025-08-04 04:32:31.183	\N	\N
134	PHONG NHA FAMILY RESTAURANT (NHÀ HÀNG GIA ĐÌNH VIỆT NAM)	Phong Nha Family Restaurant is a charming, family-run eatery located inside the Phong Nha–Kẻ Bàng heritage area, favored by both locals and travelers. The diverse menu features authentic Vietnamese dishes—from pho and spring rolls to banh mi, stir‑fried noodles, and fresh seafood—each prepared with flavorful regional herbs and a renowned homemade peanut sauce. Generous portions, vegetarian-friendly options like tofu and aubergine, and set menus ensure great value and variety. Friendly staff, indoor and outdoor seating, a relaxed garden space, and amenities like a pool table make it welcoming and convenient for an enjoyable meal after exploring the caves	17.61348940	106.31617630	Thôn 1 Cù Lạc	+84334046065	\N	\N	\N	/images/explore/PHONGNHAFAMILY1.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	511	\N	https://maps.app.goo.gl/H6RZuCGgnVfcg7ro6	t	f	t	f	2025-07-30 02:53:56.071951	2025-08-04 04:37:54.134	\N	\N
133	Phong Nha Escape Bungalow	Phong Nha Escape Bungalow is a peaceful riverside retreat located a short drive from Phong Nha town, surrounded by tranquil gardens and mountain views. The property features cozy bungalows and rooms, many with balconies or patios overlooking the river. Guests can relax by the outdoor pool, enjoy complimentary breakfast, and make use of free bicycles to explore the countryside. With warm hospitality and a quiet setting, it’s an ideal place to unwind after exploring the caves and national park.	17.61940930	106.33499230	J89M+QX9, Phong NHA, Bố Trạch, Quảng Bình 511860	+84975139140	\N	\N	\N	/images/explore/PhongNhaEscape.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	3.90	142	\N	https://maps.app.goo.gl/FnJKP6HhJZ1LB4iB8	t	f	t	f	2025-07-30 02:53:55.8382	2025-08-04 04:42:31.815	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=7346720
129	Nhà Hàng Vườn Anh Tuấn	Nhà Hàng Vườn Anh Tuấn is a charming, family‑run restaurant in Sơn Trạch, just outside Phong Nha town. It specializes in authentic Vietnamese countryside cuisine, with popular dishes like river fish in ginger sauce, tamarind crab, and fresh seasonal vegetables. The atmosphere is warm and rustic, with generous portions and friendly service. It’s a favorite stop for travelers looking to enjoy traditional flavors in a peaceful garden setting.	17.57941250	106.25466780	H7H3+QV7, Phúc Trạch, Bố Trạch, Quảng Bình	+84944648135	\N	\N	\N	/images/explore/NhaHangVuon .jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.50	120	\N	https://maps.app.goo.gl/utmtjxXuSeWkXgqG7	t	f	t	f	2025-07-30 02:53:54.896757	2025-08-04 04:27:13.353	\N	\N
130	Nhà nghỉ Đồi Sim	Nhà nghỉ Đồi Sim is a simple, welcoming guesthouse nestled near rural landscapes just outside Phong Nha town. It offers comfortable private rooms equipped with air‑conditioning, clean bathrooms, and basic amenities for a restful stay. Guests enjoy a peaceful garden setting surrounded by countryside views, and often benefit from friendly service, bike rentals, and local advice from the host. It’s a quiet, budget‑friendly choice for travelers seeking a rural escape while exploring the caves and trails of Quảng Bình.	17.58085360	106.25419230	H7J3+4P8, QL15	+84357261779	\N	\N	\N	/images/explore/NhanghiDoi.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.40	12	\N	https://maps.app.goo.gl/889y8s9FwYapor8X9	t	f	t	f	2025-07-30 02:53:55.132517	2025-08-04 04:33:56.658	\N	\N
131	Nhà vườn Thuyền Trưởng (The Captain's Garden House)	The Captain’s Garden House is a charming garden homestay tucked just outside Phong Nha town, offering a peaceful retreat surrounded by greenery. The property features cozy riverside bungalows and private rooms with balconies or terraces overlooking lush gardens and tranquil water views. Guests can enjoy leisurely outdoor seating with hammock spots, local meals served family‑style, and lush paths amid tropical plants. Welcoming hosts, bike rentals, and a friendly atmosphere make it a warm and relaxing base for exploring caves and countryside just minutes away.	17.44874660	106.64095990	Điện Biên Phủ	+84847399999	\N	\N	\N	/images/explore/Nhauon.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.40	14	\N	https://maps.app.goo.gl/qCUhvTT9tw84CkCR8	t	f	t	f	2025-07-30 02:53:55.366486	2025-08-04 04:35:08.735	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=58279658
132	Phong Nha Dawn Homestay	Phong Nha Dawn Homestay is a welcoming riverside retreat located just outside the center of Phong Nha town. The property offers comfortable rooms and bungalows with air‑conditioning, private bathrooms, and views of the garden or river. Guests can relax on the terrace, enjoy home‑cooked meals, and make use of free bicycles to explore the surrounding countryside. Known for its peaceful setting and friendly hosts, it’s a great choice for travelers looking for a quiet and relaxing stay near the national park.	17.61533222	106.31810830	Cù Lạc 1, Bố Trạch District, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/PhongNhaDawn.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.90	200	\N	https://maps.app.goo.gl/wEV5ksP1C29xXCmy5	t	f	t	f	2025-07-30 02:53:55.600217	2025-08-04 04:41:29.51	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=6412846
142	RiverView HomeStay	RiverView HomeStay is a peaceful riverside guesthouse located in Phong Nha village, close to the center of town. The property offers comfortable rooms and family suites, many with views of the river, gardens, or surrounding mountains. Guests can enjoy complimentary bicycles to explore the countryside, relax on the terrace, and start the day with a freshly prepared breakfast. With its quiet setting, friendly hosts, and convenient location, it’s an excellent choice for a relaxed stay near Phong Nha’s attractions.	17.48430346	106.62620590	Ngõ 93 Trương Pháp, Bắc Lý, Đồng Hới, Quảng Bình, Vietnam	+84326716342	\N	\N	\N	/images/explore/RiverView.jpeg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.40	143	\N	https://maps.app.goo.gl/EucM8iAPMVKGw5486	t	f	t	f	2025-07-30 02:53:57.947213	2025-08-04 04:50:00.104	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=61453548
138	Phong Nha Palafita Bungalow	Phong Nha Palafita Bungalow is a tranquil countryside retreat surrounded by rice fields, just a short ride from the center of Phong Nha town. The property offers spacious bungalows with balconies overlooking the mountains and paddies, along with a peaceful outdoor pool for relaxing after a day of exploring. Guests can enjoy fresh home‑cooked breakfasts, use free bicycles to explore the countryside, and take advantage of warm, attentive hospitality from the hosts. With its scenic location, comfortable rooms, and laid‑back atmosphere, it’s an ideal base for a quiet stay near the national park.	17.61175655	106.34869050	Cổ Giang, Phong NHA, Bố Trạch, Quảng Bình, Vietnam	+84382479313	\N	\N	\N	/images/explore/PhongNhaPalafita.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	151	\N	https://maps.app.goo.gl/XfwVGSNxBCZXiw1d6	t	f	t	f	2025-07-30 02:53:57.008169	2025-08-04 04:44:44.731	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=6425077
139	Pub with cold beer	Pub With Cold Beer is a rustic riverside spot hidden in the Bong Lai Valley, a short ride from Phong Nha town. It’s famous for serving ice‑cold beer and farm‑fresh grilled chicken with homemade peanut sauce. Visitors can relax in hammocks, play a game of pool, or cool off in the river while waiting for their meal. With its laid‑back atmosphere, simple local food, and scenic countryside setting, it’s a must‑visit stop for travelers exploring the valley.	17.59835405	106.36359710	Hưng Trạch, Bố Trạch District, Quảng Bình, Vietnam	+84397428778	\N	\N	\N	https://lh3.googleusercontent.com/gps-cs-s/AC9h4no-2b7Of4-ejtxAbmps59vqCpXosANJP42TSdJUMuOXr-gz5S-J6WkiuHbkCHyHkyLSZgftSzMGCEqACTjmKZ6iNyTMxhu5hqSnfgnWrrcfpqkoUvVPw3BQ8PS5eR7047z0HmvPMg	{}	\N	{beer}	\N	{}	none	\N	\N	f	\N	4.50	300	\N	https://maps.app.goo.gl/3MZpAqYdxHZs41K49	t	t	t	f	2025-07-30 02:53:57.242994	2025-07-30 08:25:00.131	\N	\N
136	Phong Nha green riverside city	Phong Nha Green Riverside City is a peaceful riverside guesthouse with beautiful views of the Son River and surrounding limestone mountains. The rooms are bright and comfortable, with balconies or terraces overlooking the gardens or river. Guests can relax on the outdoor terrace, enjoy home‑cooked meals, and take advantage of bike rentals for exploring the countryside. Its friendly atmosphere and excellent location make it a perfect base for visiting the caves and natural wonders of Phong Nha.	17.61924250	106.33422580	J89M+MM, Sơn Trạch, Bố Trạch, Quảng Bình	\N	\N	\N	\N	/images/explore/PhongNhagreen.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	2	\N	https://maps.app.goo.gl/PXzQyGf2nnKTmAfr7	t	f	t	f	2025-07-30 02:53:56.540309	2025-08-04 04:46:01.284	\N	\N
140	Quán Ăn 86 Tâm Thịnh Popular restaurant	Quán Ăn 86 Tâm Thịnh is a beloved local eatery located on Trường Chinh Street in Đồng Hới, known for its affordable, generous family-style portions. The menu features grilled and stir‑fried dishes, crispy-fried seafood, savory noodle soups, and seasonal specialties using local ingredients. The lively casual setting and friendly service make it a favorite among both locals and visitors looking for authentic, hearty Vietnamese flavors. It’s especially popular for dinner groups, casual gatherings, and dishes served on communal platters.	17.58529431	106.25618470	H7M4+WFQ, xóm Chày, Bố Trạch, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/QuanAn86.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.50	16	\N	https://maps.app.goo.gl/jTjwynTkYJbm6FCb7	t	f	t	f	2025-07-30 02:53:57.478318	2025-08-04 04:48:14.036	\N	\N
147	Sunflower Nhật Lệ	Sunflower Nhật Lệ is a relaxed beachfront hostel and small resort located directly on Nhật Lệ Beach in Đồng Hới. The property offers a mix of dorms, private rooms, and family suites with air-conditioning and private bathrooms—all within easy walking distance of the sand and sea. Guests can enjoy a casual beach bar, BBQ area, billiards, bike rental, and walking tours to local sights. With free parking, friendly service, and a vibrant yet chill beachside vibe, Sunflower is a popular budget-friendly base for travelers combining sea time and nearby Phong Nha adventures.	17.50197118	106.62089310	Trương Pháp, Quang Phú, Đồng Hới, Quảng Bình 510000, Vietnam	\N	\N	http://fb.me/sunflowernhatle	\N	/images/explore/Sunflower.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.00	191	\N	https://maps.app.goo.gl/yAj6wAjpLM9xC3nq8	t	f	t	f	2025-07-30 02:53:59.118371	2025-08-04 04:56:29.035	\N	\N
148	SUSHI CÔ MO	Sushi Cô Mo is a cozy Japanese restaurant in the heart of Đồng Hới, offering a charming and intimate dining atmosphere. It specializes in sushi and sashimi dishes—such as fresh salmon, eel nigiri, and crispy tempura rolls—prepared with great care and beautifully presented. The dining space is thoughtfully designed and comfortable, making it ideal for date nights, small gatherings, or relaxing meals with family. Known for high-quality ingredients, artistic plating, and attentive service, Sushi Cô Mo is a standout choice for Japanese cuisine in the city.	17.47377499	106.62123580	14A Lý Thường Kiệt, Phường Hải Thịnh, Đồng Hới, Quảng Bình 47107, Vietnam	\N	\N	\N	\N	/images/explore/SUSHI.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.40	36	\N	https://maps.app.goo.gl/8CVfjwsnYtq1XoL49	t	f	t	f	2025-07-30 02:53:59.352267	2025-08-04 04:51:58.222	\N	\N
145	Sealand homestay	Sealand Homestay is a charming family-run accommodation nestled in a quiet alley of Bảo Ninh, just a short stroll from Nhật Lệ Beach and Đồng Hới city center. The homestay combines classic colonial-style décor with modern simplicity and neutral tones, set amid garden greenery and flowering plants. Rooms are clean and comfortable, featuring air-conditioning and options for families, couples, or small groups. Guests frequently praise the friendly hosts, fresh breakfasts, helpful bicycle and motorbike rental service, and peaceful courtyard ambiance—making it a relaxing, affordable base for exploring local beaches and Phong Nha adventures.	17.47698305	106.63538710	Đồng Dương, Bảo Ninh, Đồng Hới, Quảng Bình, Vietnam	\N	\N	http://thuexemayquangbinh.com/	\N	/images/explore/Sealand.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.80	141	\N	https://maps.app.goo.gl/6MtymM4uzBSXfpqE9	t	f	t	f	2025-07-30 02:53:58.649194	2025-08-04 04:53:59.309	\N	\N
146	Sun Spa Resort	Sun Spa Resort Quảng Bình is a sophisticated beachfront resort perched on a peninsula bordered by both the pristine Bai Ninh beach and the tranquil Nhật Lệ River. Set within lush landscaped gardens spanning nearly 29 hectares, it blends classic Indochine design with modern comfort across bungalows, villas, and suite-style rooms. Guests enjoy amenities including expansive outdoor pools, a spa and wellness centre, yoga sessions, beachside lounging, and on-site restaurants—all served with attentive hospitality in a peaceful seaside setting	17.48053744	106.63383050	FJJM+3FX, Võ Nguyên Giáp, Mỹ Cảnh, Đồng Hới, Quảng Bình, Vietnam	\N	\N	https://sunsparesortvietnam.com/Rooms-Rates.html	\N	/images/explore/SunSpa .jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.30	1810	\N	https://maps.app.goo.gl/qPJjZoDsoDVz4ViZA	t	f	t	f	2025-07-30 02:53:58.883153	2025-08-04 04:55:33.132	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=292633
150	Thai Binh Street Food and Drink	Thai Binh Street Food & Drink is a lively street-side eatery in Đồng Hới where locals and travelers enjoy authentic Vietnamese dishes at affordable prices. The menu includes a variety of central Vietnam specialties such as grilled meats, noodle soups (like chao canh), and local snacks including bánh lọc and bánh bèo—often paired with flavorful dipping sauces. The casual, open-air setup buzzes with energy over evening meal hours, making it a favorite for experiencing true local street food culture. Friendly service and generous portions make it a reliable spot for a hearty, unpretentious meal after exploring the city.	17.47737045	106.62356310	54 Nguyễn Du, Đồng Hải, Đồng Hới, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/ThaiBinh.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	3.80	12	\N	https://maps.app.goo.gl/n921x6BnaSTiXDMNA	t	f	t	f	2025-07-30 02:53:59.823424	2025-08-04 04:57:26.633	\N	\N
149	Tân Hóa Rural Homestay	Tân Hóa Rural Homestay is an authentic village stay set in a peaceful riverside community surrounded by limestone mountains and green fields. The unique floating houses are designed to adapt to seasonal flooding, providing a safe and comfortable experience year‑round. Rooms are simple yet comfortable, with air‑conditioning, private bathrooms, and scenic views of the river or village. Guests can enjoy home‑cooked local meals, use bicycles to explore the countryside, and join guided tours to nearby caves and cultural sites, offering a genuine connection to rural life in Quảng Bình.	17.76618688	106.05151620	Q382+8X, Minh Hoá, Minh Hóa, Quảng Bình, Vietnam	\N	\N	https://brit-rail-adventures.eu/tan-hoa-rural-homestay-vietnam	\N	/images/explore/TanHoa.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	\N	\N	\N	https://maps.app.goo.gl/zYhHUnGRKYY2jFRT9	t	f	t	f	2025-07-30 02:53:59.586315	2025-08-04 05:04:58.359	\N	\N
154	TuTu's Homestay Phong Nha	TuTu’s Homestay is a modern, family‑run retreat located just outside Phong Nha town, surrounded by rice fields and karst mountains. The property offers spacious, comfortable rooms, many with balconies overlooking the countryside. Guests can relax by the outdoor pool, enjoy the garden terrace, and use free bicycles to explore nearby trails. With warm hospitality, delicious breakfasts, and help arranging tours and transport, it’s a welcoming base for exploring the national park.	17.61596490	106.31976000	Cù Lạc 1, Bố Trạch District, Quảng Bình	\N	\N	https://www.facebook.com/profile.php?id=61560455949395&mibextid=ZbWKwL	\N	/images/explore/TuTu.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	5.00	111	\N	https://maps.app.goo.gl/pAMP4y3piADKxrYo9	t	f	t	f	2025-07-30 02:54:00.757402	2025-08-04 05:03:48.723	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=52136496
156	Wyndham Quang Binh Golf & Beach Resort	Wyndham Quang Binh Golf & Beach Resort is a sophisticated beachfront luxury destination located on Bao Ninh Beach, just a short drive from Đồng Hới. The resort includes stylish hotel rooms, suites, and villas—many offering stunning views of the ocean or lush gardens. Guests can enjoy two outdoor pools, private beach access, spa facilities, a fitness center, golf and tennis courts, and multiple dining venues. With modern design, excellent service, and a peaceful coastal setting, it’s an ideal upscale base combining beach relaxation and easy access to Phong Nha’s natural attractions.	17.45041470	106.65325750	FM23+586, Bảo Xuân, Đồng Hới, Quảng Bình 510000	\N	\N	\N	\N	/images/explore/Wyndham.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	5.00	5	\N	https://maps.app.goo.gl/92oW88r5CWJah9px6	t	f	t	f	2025-07-30 02:54:01.225322	2025-08-04 05:10:36.027	\N	\N
137	Phong Nha Mountain House	Phong Nha Mountain House is a peaceful, family‑run retreat set just outside Phong Nha town with views of lush hills and gardens. The property features cozy wooden stilt cabins with balconies, large windows, and comfortable interiors equipped with air‑conditioning and private bathrooms. Guests can enjoy a tranquil garden terrace, complimentary breakfast, and free bicycles for exploring the surrounding countryside. With warm hospitality and a quiet rural setting, it’s an ideal base for relaxing between cave adventures.	17.59453390	106.28688040	ĐT20, Sơn Trạch, Bố Trạch, Quảng Bình	+84399187375	\N	https://www.facebook.com/profile.php?id=100089513217468&mibextid=LQQJ4d	\N	/images/explore/PhongNhaMountain.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	60	\N	https://maps.app.goo.gl/oA9HgzwmFgWKF1Q98	t	f	t	f	2025-07-30 02:53:56.774335	2025-08-04 04:43:46.411	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=2607503
152	Thien Truc Hotel	Thiên Trúc Hotel is a modest, budget-friendly guesthouse located conveniently in central Đồng Hới, well situated for trips to Phong Nha and Hang Tối. The property features simple air-conditioned rooms with private bathrooms, flat-screen TVs, free Wi‑Fi, and minibar or refreshment options in select rooms. Guests appreciate services like 24‑hour reception, daily housekeeping, luggage storage, and assistance with booking local tours or transport. With its practical location, friendly staff, and affordable rates, it’s a reliable choice for travelers looking for basic comfort and easy access to local attractions.	17.60295830	106.26242080	J736+3XW, Phúc Trạch, Bố Trạch, Quảng Bình, Vietnam	\N	\N	\N	\N	/images/explore/ThienTruc.jpg	{}	\N	{}	\N	{}	none	\N	\N	f	\N	4.10	53	\N	https://maps.app.goo.gl/EJ66QQEwjxCxffyFA	t	f	t	f	2025-07-30 02:54:00.290572	2025-08-04 05:01:40.471	\N	\N
153	Tu Lan Lodge	Tu Làn Lodge is an eco‑friendly retreat located in the scenic village of Tân Hóa, surrounded by limestone mountains and open fields. Built with flood‑resistant designs, the lodge features a mix of hillside bungalows, floating river bungalows, and locally inspired homestays. Each room offers modern comforts such as air‑conditioning, private bathrooms, and large windows or balconies with stunning views. Guests can enjoy locally inspired meals, explore the peaceful countryside by bicycle, and use the lodge as a comfortable base for nearby cave expeditions and outdoor adventures.	17.76884970	106.05051810	Yên Thọ, Minh Hoá, Quảng Bình	\N	\N	https://tulanlodge.com/	\N	/images/explore/TuLan.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	352	\N	https://maps.app.goo.gl/EJbZfPQABUzcG7gf6	t	f	t	f	2025-07-30 02:54:00.524309	2025-08-04 05:02:49.454	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=63917822
171	Victory Road Villas	Victory Road Villas is a boutique riverside retreat nestled in Phong Nha, surrounded by lush karst hills and a quiet garden courtyard. Each villa-style unit features a private entrance, comfortable king-size bedroom upstairs, living area with kitchenette, and private terrace overlooking the pool or garden. Guests love relaxing by the outdoor pool, dining at the on-site restaurant, and enjoying easy access to nearby cave excursions and countryside cycling. Attentive hosts, thoughtful amenities, and a tranquil setting make it a top choice for travelers seeking both comfort and charm in Phong Nha.	17.60685528	106.30072176	Phong Nha Ke bang National Park, Hà Lời, Phong NHA, Bố Trạch, Quảng Bình 00000, Vietnam	+84886199599	\N	http://www.victoryroadvillas.com/	\N	/images/explore/VictoryRoad1.jpg	{/images/explore/VictoryRoad2.jpg,/images/explore/VictoryRoad3.jpg,/images/explore/VictoryRoad4.jpg,/images/explore/VictoryRoad5.jpg}	\N	{luxury,beer}	\N	{}	affiliate	\N	\N	f	\N	4.80	285	\N	https://maps.app.goo.gl/z8ZizxJSCcmbzuyC7	t	f	t	f	2025-07-30 04:18:28.761669	2025-08-04 05:08:37.138	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hid=2527781
135	Phong Nha Farmstay	Phong Nha Farmstay is a boutique countryside retreat set among rice paddies and limestone mountains, about 10 km from Phong Nha town. The property offers rustic yet comfortable rooms with air‑conditioning, private bathrooms, and beautiful views of the surrounding farmland. Guests can relax by the swimming pool, enjoy sunset drinks, explore the countryside by bicycle, or take part in local tours arranged by the friendly staff. With its peaceful rural setting and warm hospitality, it’s an ideal base for both relaxation and adventure.	17.62442590	106.38529970	1 Km East of Ho Chi Minh Highway	+84917910055	\N	https://phongnhafarmstay.com/	\N	/images/explore/pnfarmstay2.jpg	{/images/explore/pnfarmstay4.jpg,/images/explore/pnfarmstay5.jpg,/images/explore/pnfarmstay6.jpg}	\N	{beer}	\N	{}	affiliate	\N	\N	f	\N	4.70	667	\N	https://maps.app.goo.gl/RLM1uYYJ2WVNzJUC7	t	t	t	f	2025-07-30 02:53:56.304251	2025-08-04 01:02:07.343	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=5860508
96	Duy Tân Resort Quảng Bình	Duy Tân Hotel & Resort Quảng Bình is a modern 4-star beachfront property located on Võ Nguyên Giáp Street in Bảo Ninh, just steps from Nhật Lệ Beach. With 168 rooms ranging from deluxe doubles to ocean-view suites, many units feature balconies with views of the sea, pool, or tropical surroundings. Guests can cool off in the large outdoor pool or children’s pool, enjoy meals at multiple on-site restaurants, and relax in spa, sauna, or fitness facilities. With free Wi‑Fi, dedicated parking, 24‑hour service, and a private beach, the resort blends comfort and convenience—making it ideal for both families and travelers exploring Phong Nha’s natural wonders.	17.46186380	106.64359510	Bảo Ninh, Đồng Hới, Quảng Bình	+842323686696	\N	http://duytanhotel.com.vn/	\N	/images/explore/DuyTan.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.10	336	\N	https://maps.app.goo.gl/frLYa6PNsBdHPn5b8	t	f	t	f	2025-07-30 02:53:47.137597	2025-08-04 02:36:58.174	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=31041275
111	Manli Resort	Manli Resort Quảng Bình is a beachfront resort located on Trương Pháp Street in Đồng Hới, just a few minutes’ walk from Nhật Lệ Beach and the nearby Ho Bàu Tró wetland area. The property offers around 100 air‑conditioned rooms with comfortable beds, minibars, flat‑screen TVs, safes, and modern bathrooms. Guests can enjoy an outdoor swimming pool with sun loungers, a landscaped garden, and private beach access. Onsite facilities include a restaurant, bar, free breakfast, Wi‑Fi, parking, bicycle rentals, laundry, and optional airport shuttle service. With helpful staff, clean accommodations, and a prime seaside location, it’s a great choice for combining a beach holiday in Đồng Hới with trips to Phong Nha.	17.50924982	106.61448800	379 Trương Pháp, Quang Phú, Đồng Hới, Quảng Bình, Vietnam	+842323868668	\N	https://manliresort.com/	\N	/images/explore/Manli.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	3.80	303	\N	https://maps.app.goo.gl/iFxySkwkDDtNvCNb8	t	f	t	f	2025-07-30 02:53:50.668752	2025-08-04 03:09:20.109	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=10666105
118	Nava Hotel & Resort	Nava Hotel & Resort is a stylish beachfront retreat located just steps away from the soft sands of Nhật Lệ Beach in Đồng Hới. The resort combines a seven-story hotel tower with spacious bungalows and villas nestled around tropical gardens and a sparkling outdoor pool. Guests can enjoy modern air-conditioned rooms with private bathrooms and terraces overlooking the pool or sea, and savor local and international dishes at the on-site restaurant and bar. With amenities like free Wi‑Fi, complimentary parking, daily housekeeping, a 24-hour front desk, and easy access to Phong Nha tours, it’s a smart and comfortable pick for beach lovers and cave explorers alike.	17.49071690	106.62668400	165 Trương Pháp	+842323889999	\N	http://navahotelquangbinh.com/	\N	/images/explore/Nava.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.80	30	\N	https://maps.app.goo.gl/NbseGTa6mfcsfbkh8	t	f	t	f	2025-07-30 02:53:52.307318	2025-08-04 04:18:27.888	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=73954815
155	voco Quang Binh Resort by IHG	voco Quang Binh Resort by IHG is a luxury beachfront resort on Bao Ninh Beach, just a short drive from Đồng Hới. The property features elegant Indochine‑style suites and villas, many with private pools and views of the ocean or gardens. Guests can enjoy multiple swimming pools, a full‑service spa with sauna and hydrotherapy, a fitness center, and a kids’ club. With excellent dining options, attentive service, and a serene location, it’s an ideal choice for combining beach relaxation with adventures in Phong Nha–Kẻ Bàng National Park.	17.45963590	106.64467000	Võ Nguyên Giáp, Street, Đồng Hới, Quảng Bình	+842326296666	\N	https://www.ihg.com/voco/hotels/us/en/dong-hoi/vdhbq/hoteldetail?cm_mmc=GoogleMaps-_-VX-_-VN-_-VDHBQ	\N	/images/explore/voco.jpg	{}	\N	{}	\N	{}	affiliate	\N	\N	f	\N	4.50	57	\N	https://maps.app.goo.gl/4oLjtRCio2aQLvpX9	t	f	t	f	2025-07-30 02:54:00.991095	2025-08-04 05:11:34.73	\N	https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945129&hl=en-us&hid=64007212
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, slug, color, icon, created_at) FROM stdin;
1	Food & Drink	food-drink	#F87D51	utensils	2025-07-27 00:13:08.395791
2	Accommodation	accommodation	#F4B942	bed	2025-07-27 00:13:08.395791
3	Kiting	kiting	#00BCD4	wind	2025-07-27 00:13:08.395791
4	Waterfall	waterfall	#6DBFB3	mountain	2025-07-27 00:13:08.395791
5	Recreation	recreation	#DC2626	bike	2025-07-27 00:13:08.395791
6	Market	market	#F97316	shopping-cart	2025-07-27 00:13:08.395791
7	Massage	massage	#EC4899	heart	2025-07-27 00:13:08.395791
8	Gym	gym	#1E40AF	dumbbell	2025-07-27 00:13:08.395791
9	Surf	surf	#0891B2	waves	2025-07-27 00:13:08.395791
10	Attractions	attractions	#D97706	camera	2025-07-27 00:13:08.395791
11	Supermarket	supermarket	#059669	shopping-bag	2025-07-27 00:13:08.395791
12	Medical	medical	#DC2626	cross	2025-07-27 00:13:08.395791
13	Mobile Phone	mobile-phone	#7C3AED	smartphone	2025-07-27 00:13:08.395791
14	Pharmacy	pharmacy	#10B981	pill	2025-07-27 00:13:08.395791
15	ATM	atm	#6B7280	credit-card	2025-07-27 00:13:08.395791
16	Mechanic	mechanic	#374151	wrench	2025-07-27 00:13:08.395791
19	Adventure	adventure	#F87D51	\N	2025-07-30 02:54:27.882103
20	Tour	tour	#F87D51	\N	2025-07-30 03:04:39.760039
22	Attraction	attraction	#00BCD4	\N	2025-07-30 03:04:39.760039
18	Caves	caves	#8B4513	\N	2025-07-30 02:54:27.882103
17	Street Food	street-food	#FF6347	utensils	2025-07-27 00:17:17.778707
21	Cave	cave	#8B4513	\N	2025-07-30 03:04:39.760039
\.


--
-- Data for Name: guestbook_comment_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guestbook_comment_likes (id, user_id, comment_id, created_at) FROM stdin;
\.


--
-- Data for Name: guestbook_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guestbook_comments (id, entry_id, author_id, author_name, comment, likes, created_at, parent_comment_id, status) FROM stdin;
\.


--
-- Data for Name: guestbook_entries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guestbook_entries (id, author_id, author_name, message, nationality, location, latitude, longitude, related_place_id, rating, likes, created_at, status, is_spam, spam_score, moderated_by, moderation_notes, ip_address, user_agent, moderated_at) FROM stdin;
30	EWATsLb4YxUqA0CKNWJORcSXb662	Glen Bowden	This is definitely our favourite place to stay when we visit Phong Nha. The friendliest staff and great vibe mean we keep coming back!		\N	\N	\N	135	5	0	2025-07-30 07:43:12.703339	approved	f	0	\N	\N	172.31.82.34	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	\N
31	EWATsLb4YxUqA0CKNWJORcSXb662	Glen Bowden	Riding across the monkey bridge sure was an exhilarating experience! The host was so enthusiastic and the giant swing was not only exciting but offered a fantastic view of the valley! Be sure to go here when you are in the area!	Australia		\N	\N	163	5	0	2025-07-30 07:50:50.692965	approved	f	0	\N	\N	172.31.82.34	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	\N
32	EWATsLb4YxUqA0CKNWJORcSXb662	Glen Bowden	This was a very delicious bowl of noodles. The ultimate way to start your day! Definitly give this place a try! 	Australian	\N	\N	\N	86	5	0	2025-08-04 07:17:39.07038	approved	f	0	\N	\N	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	\N
18	EWATsLb4YxUqA0CKNWJORcSXb662	Marketing B.	AMAZING DEALS! Visit our website www.cheapdeals.com for the BEST PRICES on tours! Call us now at +84-123-456-789 for exclusive offers! Don't miss out! LIMITED TIME ONLY! Book now at https://bestdeals.com/phong-nha	Vietnam	Phong Nha Town	\N	\N	\N	\N	0	2025-06-30 07:22:28.296656	rejected	f	95	EWATsLb4YxUqA0CKNWJORcSXb662	\N	192.168.1.2	Mozilla/5.0	\N
19	EWATsLb4YxUqA0CKNWJORcSXb662	Spam A.	Best tour best tour best tour! Amazing amazing amazing experience! Must visit must visit must visit! Book now book now book now!	Thailand	Phong Nha National Park	\N	\N	\N	\N	0	2025-06-30 07:22:28.296656	rejected	f	85	EWATsLb4YxUqA0CKNWJORcSXb662	\N	192.168.1.3	Mozilla/5.0	\N
20	EWATsLb4YxUqA0CKNWJORcSXb662	Tour S.	Great place! Contact me at spammer@email.com or call +84-999-888-777 for amazing tour packages. WhatsApp: +84-111-222-333	Singapore	Paradise Cave	\N	\N	\N	\N	0	2025-06-30 07:22:28.296656	rejected	f	90	EWATsLb4YxUqA0CKNWJORcSXb662	\N	192.168.1.4	Mozilla/5.0	\N
\.


--
-- Data for Name: guestbook_entry_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guestbook_entry_likes (id, user_id, entry_id, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: user_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_likes (id, user_id, business_id, created_at) FROM stdin;
8	EWATsLb4YxUqA0CKNWJORcSXb662	135	2025-07-30 03:29:42.583171
9	P5zbP3X0iCeWt1aua9scF7J0uov1	139	2025-07-30 09:48:49.270112
10	P5zbP3X0iCeWt1aua9scF7J0uov1	163	2025-07-30 09:57:28.376903
11	EWATsLb4YxUqA0CKNWJORcSXb662	78	2025-08-06 03:35:21.194761
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, is_active, created_at, updated_at) FROM stdin;
demo_user_sarah	sarah.chen@example.com	Sarah	Chen	\N	viewer	t	2025-06-30 03:34:34.250134	2025-06-30 03:34:34.250134
demo_user_marco	marco.rossi@example.com	Marco	Rossi	\N	viewer	t	2025-06-30 03:34:34.250134	2025-06-30 03:34:34.250134
demo_user_emma	emma.johnson@example.com	Emma	Johnson	\N	viewer	t	2025-06-30 03:34:34.250134	2025-06-30 03:34:34.250134
demo_user_david	david.kim@example.com	David	Kim	\N	viewer	t	2025-06-30 03:34:34.250134	2025-06-30 03:34:34.250134
demo_user_lisa	lisa.nguyen@example.com	Lisa	Nguyen	\N	viewer	t	2025-06-30 03:34:34.250134	2025-06-30 03:34:34.250134
P5zbP3X0iCeWt1aua9scF7J0uov1	kite@myhoaphoto.com	My	 Hoa	\N	viewer	t	2025-07-30 09:48:22.123761	2025-08-04 05:15:47.811
EWATsLb4YxUqA0CKNWJORcSXb662	glenbowdencom@gmail.com	Glen	Bowden	https://lh3.googleusercontent.com/a/ACg8ocI7SxJmSuR46nX0PktIoaVfvEh5ndNhRPU6rQEWs04SqJSK=s96-c	admin	t	2025-06-30 03:14:52.137052	2025-08-07 00:51:12.993
\.


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.articles_id_seq', 11, true);


--
-- Name: business_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.business_categories_id_seq', 1040, true);


--
-- Name: businesses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.businesses_id_seq', 171, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 22, true);


--
-- Name: guestbook_comment_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guestbook_comment_likes_id_seq', 85, true);


--
-- Name: guestbook_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guestbook_comments_id_seq', 31, true);


--
-- Name: guestbook_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guestbook_entries_id_seq', 32, true);


--
-- Name: guestbook_entry_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guestbook_entry_likes_id_seq', 36, true);


--
-- Name: user_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_likes_id_seq', 11, true);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: business_categories business_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT business_categories_pkey PRIMARY KEY (id);


--
-- Name: businesses businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: guestbook_comment_likes guestbook_comment_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comment_likes
    ADD CONSTRAINT guestbook_comment_likes_pkey PRIMARY KEY (id);


--
-- Name: guestbook_comments guestbook_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comments
    ADD CONSTRAINT guestbook_comments_pkey PRIMARY KEY (id);


--
-- Name: guestbook_entries guestbook_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entries
    ADD CONSTRAINT guestbook_entries_pkey PRIMARY KEY (id);


--
-- Name: guestbook_entry_likes guestbook_entry_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entry_likes
    ADD CONSTRAINT guestbook_entry_likes_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: user_likes user_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_likes
    ADD CONSTRAINT user_likes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: business_categories business_categories_business_id_businesses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT business_categories_business_id_businesses_id_fk FOREIGN KEY (business_id) REFERENCES public.businesses(id);


--
-- Name: business_categories business_categories_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT business_categories_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: businesses businesses_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: guestbook_comment_likes guestbook_comment_likes_comment_id_guestbook_comments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comment_likes
    ADD CONSTRAINT guestbook_comment_likes_comment_id_guestbook_comments_id_fk FOREIGN KEY (comment_id) REFERENCES public.guestbook_comments(id);


--
-- Name: guestbook_comment_likes guestbook_comment_likes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comment_likes
    ADD CONSTRAINT guestbook_comment_likes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: guestbook_comments guestbook_comments_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comments
    ADD CONSTRAINT guestbook_comments_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: guestbook_comments guestbook_comments_entry_id_guestbook_entries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comments
    ADD CONSTRAINT guestbook_comments_entry_id_guestbook_entries_id_fk FOREIGN KEY (entry_id) REFERENCES public.guestbook_entries(id);


--
-- Name: guestbook_comments guestbook_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_comments
    ADD CONSTRAINT guestbook_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.guestbook_comments(id);


--
-- Name: guestbook_entries guestbook_entries_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entries
    ADD CONSTRAINT guestbook_entries_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: guestbook_entries guestbook_entries_related_place_id_businesses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entries
    ADD CONSTRAINT guestbook_entries_related_place_id_businesses_id_fk FOREIGN KEY (related_place_id) REFERENCES public.businesses(id);


--
-- Name: guestbook_entry_likes guestbook_entry_likes_entry_id_guestbook_entries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entry_likes
    ADD CONSTRAINT guestbook_entry_likes_entry_id_guestbook_entries_id_fk FOREIGN KEY (entry_id) REFERENCES public.guestbook_entries(id);


--
-- Name: guestbook_entry_likes guestbook_entry_likes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guestbook_entry_likes
    ADD CONSTRAINT guestbook_entry_likes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_likes user_likes_business_id_businesses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_likes
    ADD CONSTRAINT user_likes_business_id_businesses_id_fk FOREIGN KEY (business_id) REFERENCES public.businesses(id);


--
-- Name: user_likes user_likes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_likes
    ADD CONSTRAINT user_likes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

