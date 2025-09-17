\connect cocos_test;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
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
-- TOC entry 220 (class 1259 OID 16491)
-- Name: instruments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instruments (
    id integer NOT NULL,
    ticker character varying(10),
    name character varying(255),
    type character varying(10)
);


--
-- TOC entry 219 (class 1259 OID 16490)
-- Name: instruments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.instruments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 219
-- Name: instruments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.instruments_id_seq OWNED BY public.instruments.id;


--
-- TOC entry 224 (class 1259 OID 16515)
-- Name: marketdata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketdata (
    id integer NOT NULL,
    instrumentid integer,
    high numeric(10,2),
    low numeric(10,2),
    open numeric(10,2),
    close numeric(10,2),
    previousclose numeric(10,2),
    date date
);


--
-- TOC entry 223 (class 1259 OID 16514)
-- Name: marketdata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marketdata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 223
-- Name: marketdata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marketdata_id_seq OWNED BY public.marketdata.id;


--
-- TOC entry 222 (class 1259 OID 16498)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    instrumentid integer,
    userid integer,
    size integer,
    price numeric(10,2),
    type character varying(10),
    side character varying(10),
    status character varying(20),
    datetime timestamp without time zone,
    idempotence_key character varying(255)
);


--
-- TOC entry 221 (class 1259 OID 16497)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 221
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 218 (class 1259 OID 16484)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255),
    accountnumber character varying(20)
);


--
-- TOC entry 217 (class 1259 OID 16483)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3203 (class 2604 OID 16494)
-- Name: instruments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instruments ALTER COLUMN id SET DEFAULT nextval('public.instruments_id_seq'::regclass);


--
-- TOC entry 3205 (class 2604 OID 16518)
-- Name: marketdata id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketdata ALTER COLUMN id SET DEFAULT nextval('public.marketdata_id_seq'::regclass);


--
-- TOC entry 3204 (class 2604 OID 16501)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3202 (class 2604 OID 16487)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3365 (class 0 OID 16491)
-- Dependencies: 220
-- Data for Name: instruments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.instruments (id, ticker, name, type) VALUES (1, 'DYCA', 'Dycasa S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (2, 'CAPX', 'Capex S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (3, 'PGR', 'Phoenix Global Resources', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (4, 'MOLA', 'Molinos Agro S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (5, 'MIRG', 'Mirgor', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (6, 'PATA', 'Importadora y Exportadora de la Patagonia', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (7, 'TECO2', 'Telecom', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (8, 'FERR', 'Ferrum S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (9, 'SAMI', 'S.A San Miguel', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (10, 'IRCP', 'IRSA Propiedades Comerciales S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (11, 'GAMI', 'Boldt Gaming S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (12, 'DOME', 'Domec', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (13, 'INTR', 'Compañía Introductora de Buenos Aires S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (14, 'MTR', 'Matba Rofex S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (15, 'FIPL', 'Fiplasto', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (16, 'GARO', 'Garovaglio Y Zorraquín', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (17, 'SEMI', 'Molinos Juan Semino', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (18, 'HARG', 'Holcim (Argentina) S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (19, 'BPAT', 'Banco Patagonia', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (20, 'RIGO', 'Rigolleau S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (21, 'CVH', 'Cablevision Holding', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (22, 'BBAR', 'Banco Frances', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (23, 'LEDE', 'Ledesma', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (24, 'CELU', 'Celulosa Argentina S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (25, 'CECO2', 'Central Costanera', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (26, 'AGRO', 'Agrometal', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (27, 'AUSO', 'Autopistas del Sol', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (28, 'BHIP', 'Banco Hipotecario S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (29, 'BOLT', 'Boldt S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (30, 'CARC', 'Carboclor S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (31, 'BMA', 'Banco Macro S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (32, 'CRES', 'Cresud S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (33, 'EDN', 'Edenor S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (34, 'GGAL', 'Grupo Financiero Galicia', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (35, 'DGCU2', 'Distribuidora De Gas Cuyano S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (36, 'GBAN', 'Gas Natural Ban S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (37, 'CGPA2', 'Camuzzi Gas del Sur', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (38, 'CADO', 'Carlos Casado', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (39, 'GCLA', 'Grupo Clarin S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (40, 'GRIM', 'Grimoldi', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (41, 'RICH', 'Laboratorios Richmond', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (42, 'MOLI', 'Molinos Río de la Plata', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (43, 'VALO', 'BCO DE VALORES ACCIONES ORD.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (44, 'TGNO4', 'Transportadora de Gas del Norte', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (45, 'LOMA', 'Loma Negra S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (46, 'IRSA', 'IRSA Inversiones y Representaciones S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (47, 'PAMP', 'Pampa Holding S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (48, 'TGSU2', 'Transportadora de Gas del Sur', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (49, 'TXAR', 'Ternium Argentina S.A', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (50, 'YPFD', 'Y.P.F. S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (51, 'MORI', 'Morixe Hermanos S.A.C.I.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (52, 'INVJ', 'Inversora Juramento S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (53, 'POLL', 'Polledo S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (54, 'METR', 'MetroGAS S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (55, 'LONG', 'Longvie', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (56, 'SUPV', 'Grupo Supervielle S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (57, 'ROSE', 'Instituto Rosenbusch', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (58, 'OEST', 'Oeste Grupo Concesionario', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (59, 'COME', 'Sociedad Comercial Del Plata', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (60, 'CEPU', 'Central Puerto', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (61, 'ALUA', 'Aluar Aluminio Argentino S.A.I.C.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (62, 'CTIO', 'Consultatio S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (63, 'TRAN', 'Transener S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (64, 'HAVA', 'Havanna Holding', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (65, 'BYMA', 'Bolsas y Mercados Argentinos S.A.', 'ACCIONES');
INSERT INTO public.instruments (id, ticker, name, type) VALUES (66, 'ARS', 'PESOS', 'MONEDA');


--
-- TOC entry 3369 (class 0 OID 16515)
-- Dependencies: 224
-- Data for Name: marketdata; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (1, 12, NULL, NULL, NULL, 20.50, 20.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (2, 35, 342.50, 328.50, 337.50, 341.50, 335.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (3, 54, 232.00, 222.50, 232.00, 232.00, 229.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (4, 51, 36.55, 35.75, 35.90, 35.95, 35.90, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (5, 52, 105.00, 98.50, 105.00, 99.70, 103.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (6, 60, 365.95, 354.45, 358.00, 364.80, 353.45, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (7, 31, 1541.00, 1415.00, 1425.00, 1520.25, 1413.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (8, 40, 400.00, 395.00, 400.00, 397.50, 400.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (9, 4, 7044.00, 6561.00, 6940.00, 6621.50, 6659.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (10, 37, 409.00, 388.50, 407.00, 400.50, 408.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (11, 44, 669.50, 655.00, 668.00, 668.00, 658.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (12, 63, 378.00, 366.00, 367.50, 373.00, 367.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (13, 18, 525.00, 494.00, 500.00, 515.50, 498.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (14, 30, 6.80, 6.66, 6.70, 6.75, 6.64, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (15, 25, 195.00, 187.00, 188.00, 192.75, 187.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (16, 19, 295.00, 266.00, 273.00, 289.00, 273.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (17, 6, 256.00, 241.25, 245.00, 251.50, 247.25, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (18, 11, 86.50, 84.00, 86.50, 86.00, 86.40, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (19, 17, 54.00, 51.50, 53.00, 53.20, 52.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (20, 64, 1170.00, 1107.00, 1107.00, 1163.00, 1122.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (21, 21, 1660.00, 1562.00, 1567.00, 1656.00, 1562.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (22, 23, 348.00, 298.00, 307.00, 337.00, 304.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (23, 39, 460.00, 433.00, 450.00, 449.65, 447.75, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (24, 1, 268.00, 255.00, 268.00, 260.00, 264.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (25, 8, 38.50, 37.00, 38.15, 37.55, 38.15, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (26, 58, 220.50, 217.00, 217.00, 220.00, 217.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (27, 14, 617.00, 612.50, 617.00, 615.00, 612.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (28, 2, 1930.00, 1850.00, 1850.00, 1918.00, 1885.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (29, 29, 8.90, 8.72, 8.80, 8.79, 8.76, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (30, 36, 330.00, 311.00, 330.00, 323.00, 325.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (31, 27, 640.00, 615.00, 640.00, 623.00, 631.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (32, 62, 535.00, 495.00, 535.00, 519.00, 530.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (33, 15, 66.00, 64.00, 64.00, 66.00, 65.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (34, 13, 75.00, 75.00, 75.00, 75.00, 72.30, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (35, 26, 140.00, 132.00, 134.25, 138.00, 136.75, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (36, 24, 313.50, 302.00, 309.00, 310.00, 306.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (37, 32, 430.00, 408.30, 415.00, 429.45, 405.10, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (38, 22, 1076.90, 1031.00, 1039.00, 1062.20, 1020.90, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (39, 57, 21.40, 21.40, 21.40, 21.40, 21.40, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (40, 9, 315.00, 305.00, 313.00, 310.00, 313.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (41, 65, 368.00, 360.00, 363.50, 362.00, 360.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (42, 59, 43.20, 40.20, 40.45, 42.90, 39.90, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (43, 41, 546.00, 502.00, 508.50, 543.00, 500.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (44, 38, 163.50, 160.00, 162.25, 163.25, 162.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (45, 5, 9297.50, 9121.00, 9150.00, 9278.00, 9114.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (46, 61, 412.00, 391.00, 391.00, 412.00, 391.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (47, 55, 19.40, 18.70, 18.90, 19.05, 19.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (48, 42, 682.00, 646.00, 663.00, 657.50, 661.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (49, 20, 565.00, 540.00, 540.00, 565.00, 580.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (50, 34, 925.85, 875.00, 875.00, 917.75, 864.90, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (51, 46, 439.00, 421.00, 428.35, 431.90, 428.60, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (52, 45, 746.00, 701.80, 701.80, 734.35, 696.60, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (53, 47, 924.60, 896.00, 900.00, 921.80, 893.65, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (54, 56, 340.25, 311.60, 311.60, 338.85, 311.60, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (55, 7, 684.50, 665.70, 670.00, 672.65, 664.25, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (56, 48, 1440.00, 1403.65, 1410.50, 1437.55, 1394.20, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (57, 49, 458.00, 425.50, 428.00, 448.00, 428.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (58, 43, 110.00, 106.00, 107.00, 108.50, 106.50, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (59, 50, 8035.00, 7746.55, 7746.55, 7975.05, 7673.65, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (60, 16, 58.50, 56.00, 56.00, 56.10, 56.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (61, 53, NULL, NULL, NULL, 62.00, 62.00, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (62, 28, 35.00, 31.90, 33.00, 34.60, 33.15, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (63, 33, 421.30, 382.00, 394.00, 418.50, 381.65, '2023-07-13');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (64, 62, 523.00, 510.00, 520.00, 520.00, 519.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (65, 12, 20.50, 20.50, 20.50, 20.50, 20.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (66, 42, 669.00, 638.00, 657.50, 648.50, 657.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (67, 35, 340.00, 333.00, 336.00, 338.00, 341.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (68, 15, 93.00, 68.50, 69.00, 88.70, 66.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (69, 54, 233.00, 225.25, 232.00, 229.50, 232.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (70, 48, 1435.55, 1380.00, 1434.05, 1397.70, 1437.55, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (71, 51, 36.70, 34.60, 35.80, 36.00, 35.95, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (72, 13, 77.00, 74.80, 74.90, 77.00, 75.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (73, 52, 103.00, 98.00, 101.00, 102.00, 99.70, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (74, 20, 565.00, 565.00, 565.00, 565.00, 565.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (75, 60, 369.65, 356.25, 369.65, 363.00, 364.80, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (76, 26, 140.00, 134.25, 138.00, 138.00, 138.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (77, 31, 1560.00, 1470.00, 1525.00, 1502.80, 1520.25, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (78, 16, 57.00, 55.00, 55.00, 56.10, 56.10, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (79, 40, 395.00, 390.00, 395.00, 392.50, 397.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (80, 24, 322.50, 295.00, 295.00, 322.00, 310.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (81, 4, 6840.00, 6500.00, 6650.00, 6640.00, 6621.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (82, 34, 918.90, 870.00, 915.80, 885.80, 917.75, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (83, 37, 412.00, 388.00, 390.00, 400.50, 400.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (84, 32, 429.50, 410.00, 421.50, 424.25, 429.45, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (85, 44, 668.50, 640.50, 668.00, 650.00, 668.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (86, 49, 455.00, 426.00, 455.00, 429.00, 448.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (87, 63, 373.00, 360.00, 373.00, 369.50, 373.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (88, 22, 1062.00, 1002.00, 1047.00, 1038.10, 1047.17, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (89, 18, 516.00, 500.50, 515.00, 505.50, 515.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (90, 46, 431.80, 419.30, 431.80, 420.10, 431.90, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (91, 30, 7.02, 6.80, 6.80, 7.00, 6.75, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (92, 57, 21.40, 21.40, 21.40, 21.40, 21.40, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (93, 25, 196.00, 189.00, 190.00, 195.00, 192.75, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (94, 28, 35.50, 32.60, 35.40, 33.40, 34.60, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (95, 19, 291.00, 275.00, 291.00, 279.00, 289.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (96, 9, 317.00, 305.50, 312.00, 309.50, 310.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (97, 6, 257.00, 244.00, 252.50, 251.00, 251.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (98, 45, 744.45, 724.00, 730.00, 734.65, 734.35, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (99, 11, 86.90, 84.00, 86.90, 84.30, 86.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (100, 65, 370.50, 361.00, 363.00, 369.50, 362.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (101, 17, 58.00, 53.00, 53.50, 57.20, 53.20, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (102, 43, 110.00, 106.00, 106.50, 107.50, 108.50, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (103, 64, 1190.00, 1150.00, 1170.00, 1180.00, 1163.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (104, 59, 43.30, 41.75, 43.00, 42.75, 42.90, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (105, 21, 1680.00, 1580.00, 1659.50, 1660.00, 1656.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (106, 47, 927.70, 902.05, 920.15, 925.85, 921.80, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (107, 23, 350.00, 320.00, 338.50, 341.50, 337.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (108, 41, 579.00, 525.00, 546.00, 550.00, 543.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (109, 39, 455.00, 437.00, 455.00, 450.60, 449.65, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (110, 53, 60.00, 60.00, 60.00, 60.00, 62.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (111, 1, 278.00, 240.00, 260.00, 259.00, 260.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (112, 38, 167.00, 161.50, 165.00, 166.50, 163.25, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (113, 8, 39.00, 37.80, 38.80, 38.80, 37.55, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (114, 56, 335.55, 322.00, 335.15, 328.10, 338.85, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (115, 58, 220.25, 214.00, 219.50, 220.25, 220.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (116, 5, 9299.50, 8899.50, 9299.50, 9163.00, 9278.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (117, 14, 615.00, 614.50, 615.00, 615.00, 615.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (118, 50, 7901.25, 7752.00, 7901.25, 7837.50, 7975.05, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (119, 2, 1920.00, 1850.00, 1850.00, 1865.00, 1918.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (120, 61, 413.00, 395.00, 411.50, 410.00, 412.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (121, 29, 8.94, 8.80, 8.84, 8.93, 8.79, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (122, 7, 675.00, 647.00, 674.00, 651.85, 672.65, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (123, 36, 316.00, 311.00, 311.00, 315.00, 323.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (124, 55, 19.30, 18.75, 19.10, 19.00, 19.05, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (125, 27, 636.00, 620.00, 636.00, 624.00, 623.00, '2023-07-14');
INSERT INTO public.marketdata (id, instrumentid, high, low, open, close, previousclose, date) VALUES (126, 33, 418.50, 407.20, 418.00, 414.70, 418.50, '2023-07-14');


--
-- TOC entry 3367 (class 0 OID 16498)
-- Dependencies: 222
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (1, 66, 1, 1000000, 1.00, 'MARKET', 'CASH_IN', 'FILLED', '2023-07-12 12:11:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (2, 47, 1, 50, 930.00, 'MARKET', 'BUY', 'FILLED', '2023-07-12 12:31:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (3, 47, 1, 50, 920.00, 'LIMIT', 'BUY', 'CANCELLED', '2023-07-12 14:21:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (4, 47, 1, 10, 940.00, 'MARKET', 'SELL', 'FILLED', '2023-07-12 14:51:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (5, 45, 1, 50, 710.00, 'LIMIT', 'BUY', 'NEW', '2023-07-12 15:14:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (6, 47, 1, 100, 950.00, 'MARKET', 'SELL', 'REJECTED', '2023-07-12 16:11:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (7, 31, 1, 60, 1500.00, 'LIMIT', 'BUY', 'NEW', '2023-07-13 11:13:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (8, 66, 1, 100000, 1.00, 'MARKET', 'CASH_OUT', 'FILLED', '2023-07-13 12:31:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (9, 31, 1, 20, 1540.00, 'LIMIT', 'BUY', 'FILLED', '2023-07-13 12:51:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (10, 54, 1, 500, 250.00, 'MARKET', 'BUY', 'FILLED', '2023-07-13 14:11:20');
INSERT INTO public.orders (id, instrumentid, userid, size, price, type, side, status, datetime) VALUES (11, 31, 1, 30, 1530.00, 'MARKET', 'SELL', 'FILLED', '2023-07-13 15:13:20');


--
-- TOC entry 3363 (class 0 OID 16484)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, email, accountnumber) VALUES (1, 'emiliano@test.com', '10001');
INSERT INTO public.users (id, email, accountnumber) VALUES (2, 'jose@test.com', '10002');
INSERT INTO public.users (id, email, accountnumber) VALUES (3, 'francisco@test.com', '10003');
INSERT INTO public.users (id, email, accountnumber) VALUES (4, 'juan@test.com', '10004');


--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 219
-- Name: instruments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.instruments_id_seq', 66, true);


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 223
-- Name: marketdata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marketdata_id_seq', 126, true);


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 221
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 3209 (class 2606 OID 16496)
-- Name: instruments instruments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instruments
    ADD CONSTRAINT instruments_pkey PRIMARY KEY (id);


--
-- TOC entry 3213 (class 2606 OID 16520)
-- Name: marketdata marketdata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketdata
    ADD CONSTRAINT marketdata_pkey PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 16503)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 16489)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3216 (class 2606 OID 16521)
-- Name: marketdata marketdata_instrumentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketdata
    ADD CONSTRAINT marketdata_instrumentid_fkey FOREIGN KEY (instrumentid) REFERENCES public.instruments(id);


--
-- TOC entry 3214 (class 2606 OID 16504)
-- Name: orders orders_instrumentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_instrumentid_fkey FOREIGN KEY (instrumentid) REFERENCES public.instruments(id);


--
-- TOC entry 3215 (class 2606 OID 16509)
-- Name: orders orders_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);

