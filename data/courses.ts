import type { GolfCourse } from '../types';

const coursesCSV = `name;address;municipality;province;region;phone;email;url;latitude;longitude
Abirradero Golf;Pago Abirradero s/n;Morón de la Frontera;Sevilla;Andalucía;+34 607 73 89 22;No disponible;No disponible;37,1086;-5,4675
Aguilon Golf;Mundo Aguilón, Av. del Golf, 13;Pulpí;Almería;Andalucía;+34 950 10 99 20;info@aguilongolf.es;https://www.aguilongolf.es/;37,3705;-1,7247
Alcaidesa Links Golf Resort;Av. Pablo Cerezo, s/n;San Roque;Cádiz;Andalucía;+34 956 79 10 40;golf@alcaidesa.com;https://www.alcaidesagolf.com/;36,2231;-5,3419
Alhaurín Golf;Ctra. MA-404, km 59;Alhaurín el Grande;Málaga;Andalucía;+34 952 59 59 78;info@alhauringolf.com;https://alhauringolf.com/;36,6186;-4,7214
Aloha Golf Club;Urb. Aloha, Nueva Andalucía;Marbella;Málaga;Andalucía;+34 952 90 70 85;info@alohagolfclub.com;http://www.alohagolfclub.com/;36,5094;-4,9653
Almenara Golf;Avda. Almenara, s/n;Sotogrande;Cádiz;Andalucía;+34 956 58 20 54;almenara.golf@sotogrande.com;https://www.lafincaresort.com/es/golf/almenara-golf;36,2917;-5,3208
Almerimar Golf;Paseo de la Balsa, 7;El Ejido;Almería;Andalucía;+34 950 49 74 54;reservas@golfalmerimar.com;http://www.golfalmerimar.com/;36,6961;-2,7933
Añoreta Resort;Av. del Golf, s/n;Rincón de la Victoria;Málaga;Andalucía;+34 952 40 40 00;info@anoretaresort.com;https://www.anoretaresort.com/;36,7231;-4,2569
Arcos Gardens Golf Club;Ctra. de Algar, km 3;Arcos de la Frontera;Cádiz;Andalucía;+34 856 09 00 13;info@arcosgardens.com;http://www.arcosgardens.com/;36,7214;-5,7608
Atalaya Golf & Country Club;Ctra. de Benahavís, km 0.7;Estepona;Málaga;Andalucía;+34 952 88 28 12;info@atalaya-golf.com;https://www.atalaya-golf.com/;36,4883;-5,0219
Azata Golf;Camino de la Boticaria, s/n;Estepona;Málaga;Andalucía;+34 951 56 09 66;info@azatagolf.com;https://azatagolf.com/;36,4272;-5,1883
Baviera Golf;Urb. Baviera Golf, s/n;Caleta de Vélez;Málaga;Andalucía;+34 952 55 50 15;info@bavieragolf.com;https://bavieragolf.com/;36,7561;-4,0869
Cabopino Golf Marbella;Urb. Artola Alta, s/n;Marbella;Málaga;Andalucía;+34 952 85 02 82;info@cabopinogolfmarbella.com;https://www.cabopinogolfmarbella.com/;36,4914;-4,7503
Calanova Golf Club;Urb. Calanova Golf, s/n;Mijas;Málaga;Andalucía;+34 952 58 76 53;info@calanovagolf.es;https://www.calanovagolf.es/;36,5511;-4,6897
CASARES COSTA GOLF;Ctra de Casares, km 0.7;Casares;Málaga;Andalucía;+34 952 93 78 83;recepcion@casarescostagolf.com;https://casarescostagolf.com/;36,4425;-5,2286
C.G. Hato Verde;C/ Hato Verde, s/n;Guillena;Sevilla;Andalucía;+34 955 79 70 70;info@hatoverde.com;https://www.hatoverde.com/;37,5217;-6,0583
C.G. La Cañada;Ctra. de Guadiaro, s/n;Guadiaro;Cádiz;Andalucía;+34 956 79 41 00;info@lacanadagolf.com;https://www.lacanadagolf.com/;36,2917;-5,3083
C.G. Pozoblanco;Ctra. Pozoblanco a Villaharta, km 8;Pozoblanco;Córdoba;Andalucía;+34 957 77 17 21;info@golfpozoblanco.es;https://www.golfpozoblanco.es/;38,3158;-4,8569
Club de Campo de Córdoba;Ctra. de las Ermitas, km. 5,8;Córdoba;Córdoba;Andalucía;+34 957 33 11 05;club@clubdecampocordoba.com;https://www.clubdecampocordoba.com/;37,9158;-4,8142
Club de Golf Bellavista;Ctra. Aljaraque-Cartaya, km 6;Aljaraque;Huelva;Andalucía;+34 959 31 90 19;info@golfbellavista.com;http://www.golfbellavista.com/;37,2428;-7,0253
Club de Golf Playa Serena;Paseo del Golf, 8;Roquetas de Mar;Almería;Andalucía;+34 950 33 30 55;oficina@golfplayaserena.com;http://www.golfplayaserena.com/;36,7264;-2,6358
Costa Ballena Ocean Golf Club;Urb. Costa Ballena, s/n;Rota;Cádiz;Andalucía;+34 956 84 70 50;info@ballenagolf.com;https://www.ballenagolf.com/;36,7356;-6,4253
Cortijo Club de Campo;Camino de la Almazara, s/n;Las Gabias;Granada;Andalucía;+34 958 58 20 44;info@cortijoclubdecampo.com;https://www.cortijoclubdecampo.com/;37,1422;-3,6894
Desert Springs Golf Club;Urb. El Salar, s/n;Cuevas del Almanzora;Almería;Andalucía;+34 950 467 100;info@desertspringsresort.es;https://www.desertspringsresort.es/;37,2806;-1,8219
Doña Julia Golf Club;Urb. Doña Julia, Ctra A-7, Salida 146;Casares;Málaga;Andalucía;+34 952 93 77 59;reservas@donajuliagolf.es;https://www.donajuliagolf.es/;36,3986;-5,2281
El Candado Club de Golf;C/ Golf, 2;Málaga;Málaga;Andalucía;+34 952 29 93 38;info@clubelcandado.com;https://www.clubelcandado.com/golf;36,7153;-4,3469
El Chaparral Club de Golf;Urb. El Chaparral, N-340, km 203;Mijas;Málaga;Andalucía;+34 952 58 77 33;info@golfelchaparral.com;https://www.golfelchaparral.com/;36,5272;-4,6736
El Paraíso Golf Club;Ctra. de Cádiz-Málaga, N-340, km 167;Estepona;Málaga;Andalucía;+34 952 88 38 35;info@elparaisogolf.com;https://www.elparaisogolf.com/;36,4789;-5,0394
Estepona Golf;Ctra. de Estepona-Cádiz, A-7, km 150;Estepona;Málaga;Andalucía;+34 952 93 76 05;info@esteponagolf.com;https://www.esteponagolf.com/;36,4022;-5,2206
Finca Cortesin Golf Club;Carretera de Casares s/n;Casares;Málaga;Andalucía;+34 952 93 78 83;reservas.golf@fincacortesin.es;https://www.fincacortesin.com/es/golf;36,4425;-5,2286
Granada Club de Golf;C/ de los Cosarios, s/n;Las Gabias;Granada;Andalucía;+34 958 58 44 36;info@granadaclubdegolf.com;http://www.granadaclubdegolf.com/;37,1367;-3,6819
Guadalhorce Club de Golf;Ctra. Cártama, km 7;Campanillas;Málaga;Andalucía;+34 952 17 93 68;info@guadalhorce.com;https://www.guadalhorce.com/es/;36,7119;-4,5419
Guadalmina Golf;Urb. Guadalmina Alta s/n;San Pedro de Alcántara;Málaga;Andalucía;+34 952 88 33 75;info@guadalminagolf.com;https://www.guadalminagolf.com/;36,4811;-4,9953
Islantilla Golf Resort;Paseo de las Cumbres, s/n;Islantilla;Huelva;Andalucía;+34 959 48 60 39;reservas@islantillagolfresort.com;https://www.islantillagolfresort.com/golf;37,2181;-7,2519
Isla Canela Golf;Calle de los Camaleones s/n;Ayamonte;Huelva;Andalucía;+34 959 47 70 93;reservas.golf@islacanela.es;https://islacanelagolf.com/;37,2025;-7,3683
La Cala Resort;Urb. La Cala Golf, s/n;Mijas;Málaga;Andalucía;+34 952 66 90 16;golf@lacala.com;https://www.lacala.com/es/;36,5619;-4,7083
La Duquesa Golf;Urb. El Hacho, s/n;Manilva;Málaga;Andalucía;+34 952 89 07 25;golfladuquesa@golfladuquesa.com;http://www.golfladuquesa.com/;36,3619;-5,2419
La Envía Golf;Urb. La Envía, Avda. de la Envía, s/n;Vícar;Almería;Andalucía;+34 950 55 96 46;reservasgolf@laenviagolf.com;https://www.laenviagolf.com/;36,8517;-2,5819
La Estancia Golf;Urb. Campano, Ctra. N-340, km 14.2;Chiclana de la Frontera;Cádiz;Andalucía;+34 956 53 20 96;info@golfestancia.com;https://www.golfestancia.com/;36,3719;-6,1419
La Garza;Paraje La Garza, s/n;Linares;Jaén;Andalucía;+34 953 60 71 89;recepcion.lagarza@andalucia.org;https://www.lagarzajaen.com/campo-de-golf/;38,0772;-3,6406
La Monacilla Golf Club;Av. de los Pirineos, s/n;Aljaraque;Huelva;Andalucía;+34 959 10 00 53;reservas@lamonacillagolf.com;https://lamonacillagolf.com/;37,2617;-6,9919
La Noria Golf & Resort;Camino Viejo de Coín, 5;Mijas;Málaga;Andalucía;+34 952 47 49 02;info@lanoriagolf.com;https://www.lanoriagolf.com/;36,5383;-4,6725
La Quinta Golf & Country Club;Urb. La Quinta, s/n;Benahavís;Málaga;Andalucía;+34 952 76 20 00;info@laquintagolf.com;https://www.laquintagolf.com/;36,5019;-4,9919
La Reserva Club Sotogrande;Avenida La Reserva s/n;Sotogrande;Cádiz;Andalucía;+34 956 785 252;lareserva@sotogrande.com;https://www.sotogrande.com/la-reserva-club/;36,2942;-5,3347
Las Brisas Real Club de Golf;Calle 1, Nueva Andalucía;Marbella;Málaga;Andalucía;+34 952 81 30 21;info@realclubdegolflasbrisas.com;https://www.realclubdegolflasbrisas.com/;36,5072;-4,9753
Lauro Golf;Ctra. de Málaga a Coín, A-404, km 14;Alhaurín de la Torre;Málaga;Andalucía;+34 952 41 27 67;info@laurogolf.com;https://www.laurogolf.com/es/;36,6517;-4,6219
Los Arqueros Golf & Country Club;Ctra. de Ronda, A-397, km 44.5;Benahavís;Málaga;Andalucía;+34 952 78 46 00;info@losarquerosgolf.com;http://www.losarquerosgolf.com/;36,5117;-5,0219
Los Moriscos Golf Club;Playa Granada, s/n;Motril;Granada;Andalucía;+34 958 82 55 27;info@moriscosgolf.com;https://www.moriscosgolf.com/;36,7217;-3,5419
Los Naranjos Golf Club;Plaza de Cibeles s/n, Nueva Andalucía;Marbella;Málaga;Andalucía;+34 952 81 24 28;info@losnaranjos.com;https://www.losnaranjos.com/es/;36,5113;-4,9769
Marbella Club Golf Resort;Ctra. de Benahavís, Km. 3,7;Benahavís;Málaga;Andalucía;+34 952 88 06 08;reserv.golf@marbellaclub.com;https://www.marbellaclub.com/es/golf-riding;36,5161;-5,0456
Marbella Golf Country Club;Ctra. de Cádiz, N-340, km 188;Marbella;Málaga;Andalucía;+34 952 83 05 00;reservas@marbellagolf.com;https://www.marbellagolf.com/;36,5017;-4,8019
Mijas Golf Club;Camino Viejo de Coín, km 3.5;Mijas;Málaga;Andalucía;+34 952 47 68 43;info@mijasgolf.org;https://www.mijasgolf.org/;36,5517;-4,6519
Miraflores Golf Club;Urb. Riviera del Sol, s/n;Mijas Costa;Málaga;Andalucía;+34 952 93 19 60;info@mirafloresgolf.es;https://www.mirafloresgolf.es/;36,5017;-4,7019
Montecastillo Barceló Golf Club;Ctra. de Arcos, km. 6;Jerez de la Frontera;Cádiz;Andalucía;+34 956 15 12 13;montecastillo.golf@barcelo.com;https://www.barcelo.com/es/barcelo-montecastillo-golf/;36,7017;-6,0419
Montenmedio Golf & Country Club;Ctra. N-340, km. 42.5;Vejer de la Frontera;Cádiz;Andalucía;+34 956 45 50 04;golf@montenmedio.com;https://www.montenmediogolf.com/;36,2717;-5,9319
Nuevo Portil Golf;Urb. Nuevo Portil, C/ Faisán, 2;Cartaya;Huelva;Andalucía;+34 959 52 87 00;golf@nuevoportil.com;https://www.golfnuevoportil.es/;37,2217;-7,0719
Parador de Málaga Golf;Autovía MA-20 (Málaga-Algeciras), Salida 1;Málaga;Málaga;Andalucía;+34 952 38 12 55;malaga.golf@parador.es;https://paradores.es/es/parador-de-malaga-golf;36,6617;-4,4719
RCG El Rompido;Ctra. Cartaya-El Rompido, Km. 7;Cartaya;Huelva;Andalucía;+34 959 02 42 42;reservasgolf@precisehotels.com;https://www.rompidogolf.com/;37,2217;-7,1183
Real Club de Campo de Málaga;Ctra. Guadalmar, 10;Málaga;Málaga;Andalucía;+34 952 38 12 55;malaga.golf@parador.es;https://paradores.es/es/parador-de-malaga-golf;36,6617;-4,4719
Real Club de Golf de Sevilla;Autovía Sevilla-Utrera, Km. 3,2;Alcalá de Guadaíra;Sevilla;Andalucía;+34 954 12 43 01;info@sevillagolf.com;https://www.sevillagolf.com/;37,3328;-5,9225
Real Club de Golf Sotogrande;Paseo del Parque s/n;Sotogrande;Cádiz;Andalucía;+34 956 78 50 14;info@golfsotogrande.com;http://www.golfsotogrande.com/;36,2794;-5,2983
Real Club Pineda;Avda. de Jerez s/n;Sevilla;Sevilla;Andalucía;+34 954 61 14 00;oficinas@rcpineda.com;https://www.rcpineda.com/;37,3517;-5,9819
Real Valderrama Club de Golf;Avda. de los Cortijos s/n;Sotogrande;Cádiz;Andalucía;+34 956 791 200;greenfees@valderrama.com;https://www.valderrama.com/;36,2891;-5,3583
Río Real Golf;Urb. Río Real, s/n;Marbella;Málaga;Andalucía;+34 952 76 57 32;info@rioreal.com;https://www.rioreal.com/es/;36,5117;-4,8419
San Roque Club;Carretera N-340, Km 127;San Roque;Cádiz;Andalucía;+34 956 61 30 30;info@sanroqueclub.com;https://www.sanroqueclub.com/;36,2736;-5,3400
Sancti Petri Hills Golf;C/ Hércules, Urb. Loma de Sancti Petri;Chiclana de la Frontera;Cádiz;Andalucía;+34 956 49 20 86;info@sanctipetrihillsgolf.com;https://www.sanctipetrihillsgolf.com/;36,3617;-6,1619
Santa Clara Golf Club Granada;Ctra. de Málaga, km 132;Otura;Granada;Andalucía;+34 958 55 55 45;info@santaclaragolfgranada.com;https://www.santaclaragolfgranada.com/;37,0717;-3,6419
Santa Clara Golf Marbella;Ctra. N-340, km 186.5;Marbella;Málaga;Andalucía;+34 952 85 01 11;reservas@santaclaragolfmarbella.com;https://www.santaclaragolfmarbella.com/;36,5017;-4,8119
Santana Golf;Ctra. de La Cala a Entrerríos, km 2;Mijas;Málaga;Andalucía;+34 951 06 25 60;info@santanagolf.com;https://www.santanagolf.com/es/;36,5417;-4,6819
Sherry Golf Jerez;Ctra. de Arcos, km 6;Jerez de la Frontera;Cádiz;Andalucía;+34 956 08 83 30;info@sherrygolf.com;https://www.sherrygolf.com/;36,7017;-6,0519
The San Roque Club;N-340, Km 127;San Roque;Cádiz;Andalucía;+34 956 613 030;info@sanroqueclub.com;https://www.sanroqueclub.com/;36,2736;-5,3400
Valle Romano Golf & Resort;Urb. Valle Romano, Calle Villa Borghese, 1;Estepona;Málaga;Andalucía;+34 952 80 06 00;info@valleromano.net;https://www.valleromano.net/es/golf/;36,4417;-5,1819
Villa Padierna Golf Club;Ctra. de Cádiz N340, Km 166;Benahavís;Málaga;Andalucía;+34 952 88 91 57;info@villapadiernagolfclub.com;https://www.villapadiernagolfclub.com/es;36,4883;-5,0611
Villanueva Golf;C/ Miguel Ángel Jiménez, s/n;Puerto Real;Cádiz;Andalucía;+34 956 47 41 23;info@villanuevagolf.com;https://www.villanuevagolf.com/;36,5617;-6,1819
Zaudín Golf Club;Av. de la Filosofía, s/n;Tomares;Sevilla;Andalucía;+34 954 15 11 00;info@zaudingolf.com;https://www.zaudingolf.com/;37,3617;-6,0419
Golf de Guara;Carretera A-1215, Km 9,8;Apiés;Huesca;Aragón;+34 974 27 00 27;info@golfdeguara.com;http://www.golfdeguara.com/;42,2289;-0,4194
Las Ranillas Urban Club;Av. de Ranillas, 107;Zaragoza;Zaragoza;Aragón;+34 976 52 64 20;info@lasranillas.com;https://lasranillas.com/;41,6703;-0,9083
Club de Golf La Peñaza;Carretera de Madrid N-IIa, km 313;Zaragoza;Zaragoza;Aragón;+34 976 12 36 00;info@golflapenaza.com;https://www.golflapenaza.com/;41,6117;-1,0019
Real Club de Golf de Zaragoza;Barrio de la Base Aérea, s/n;Zaragoza;Zaragoza;Aragón;+34 976 75 25 11;info@rcgzaragoza.com;https://www.rcgzaragoza.com/;41,6186;-1,0125
Augusta Golf Calatayud;Carretera Nacional II, km 239;Calatayud;Zaragoza;Aragón;+34 976 89 20 20;info@augustagolfcalatayud.com;https://www.augustagolfcalatayud.com/;41,3364;-1,6031
Golf Jaca;Calle Única, s/n;Badaguás;Huesca;Aragón;+34 974 35 60 50;reservas@badaguas.com;http://www.badaguas.com/servicios/golf/;42,5411;-0,4817
Benasque Club;Carretera de Francia, km 6.5;Benasque;Huesca;Aragón;+34 974 55 10 32;info@benasqueclub.com;http://www.benasqueclub.com/;42,6100;0,5311
El Castillejo;Carretera N-211, km 39;Alcalá de la Selva;Teruel;Aragón;+34 978 80 10 03;info@elcastillejo.es;http://www.elcastillejo.es/;40,3800;-0,8800
Real Club de Golf de Castiello;Camino del Rellán, 269. Castiello de Bernueces;Gijón;Asturias;Principado de Asturias;+34 985 36 63 13;info@realclubdegolfdecastiello.com;https://www.realclubdegolfdecastiello.com/;43,5117;-5,6219
Club de Golf La Barganiza;Carretera de La Barganiza, s/n;Siero;Asturias;Principado de Asturias;+34 985 74 24 68;info@golflabarganiza.com;https://www.golflabarganiza.com/;43,4358;-5,7289
Club de Golf La Llorea;Carretera de la Llorea, 1655;Gijón;Asturias;Principado de Asturias;+34 985 13 31 40;info@golflallorea.com;https://www.golflallorea.com/;43,5153;-5,5786
Club de Golf La Fresneda;Av. de la Fresneda, 107;Siero;Asturias;Principado de Asturias;+34 985 79 50 11;info@golflafresneda.com;http://www.golflafresneda.com/;43,3986;-5,7892
Los Balagares Golf;Urbanización Los Balagares;Corvera de Asturias;Asturias;Principado de Asturias;+34 985 53 50 50;info@losbalagaresgolf.com;http://www.losbalagaresgolf.com/;43,5417;-5,8819
Villaviciosa Golf;Parroquia de San Martín del Mar, 10;Villaviciosa;Asturias;Principado de Asturias;+34 985 89 24 53;info@villaviciosagolf.com;https://www.villaviciosagolf.com/;43,4919;-5,4125
Campo Municipal de Golf Las Caldas;Paseo de la Castellana, s/n;Oviedo;Asturias;Principado de Asturias;+34 985 79 81 41;info@lascaldasvillatermal.com;https://www.lascaldasvillatermal.com/golf/;43,3442;-5,9189
Campo de Golf Cierro Grande;Barrio de Cierro, s/n;Tapia de Casariego;Asturias;Principado de Asturias;+34 609 82 28 85;info@golfcierrogrande.com;http://www.golfcierrogrande.com/;43,5658;-6,9297
Campo Municipal de Golf de Llanes;Cué;Llanes;Asturias;Principado de Asturias;+34 985 41 72 30;info@golflanes.com;https://www.golflanes.com/;43,4217;-4,7867
Campo de Golf de la Rasa de Berbes;Berbes, s/n;Ribadesella;Asturias;Principado de Asturias;+34 985 86 07 72;info@rasadeberbes.com;http://www.rasadeberbes.com/;43,4542;-5,1383
Club de Golf de Luarca;El Chano, s/n;Valdés;Asturias;Principado de Asturias;+34 689 77 15 28;info@luarcagolfclub.com;https://luarcagolfclub.com/;43,5358;-6,5056
Club de Golf Maderal;Carretera de la Peral, s/n;Illas;Asturias;Principado de Asturias;+34 985 50 71 85;info@golfmaderal.com;http://www.golfmaderal.es/;43,5042;-5,9525
Deva Golf Pitch & Putt;Camino de los Gavilanes, 3369;Gijón;Asturias;Principado de Asturias;+34 985 13 32 31;info@devagolf.es;https://www.devagolf.es/;43,5083;-5,6025
Escuela de Golf El Tragamón;Camino del Tragamón, 1690;Gijón;Asturias;Principado de Asturias;+34 985 13 03 60;escuelagolf@gijon.es;https://deporte.gijon.es/page/5923-escuela-de-golf-el-tragamon;43,5133;-5,6108
Club de Golf de Castropol;Finca de la Alameda, s/n;Castropol;Asturias;Principado de Asturias;+34 639 98 12 79;info@golfcastropol.es;https://www.golfcastropol.es/;43,5283;-6,9961
Abama Golf;Carretera General, TF-47, km 9;Guía de Isora;Santa Cruz de Tenerife;Canarias;+34 922 12 66 38;info.abama@ritzcarlton.com;https://www.abamahotels.com/es/golf/;28,1969;-16,8042
Amarilla Golf;Avda. de la Gaviota, 2;San Miguel de Abona;Santa Cruz de Tenerife;Canarias;+34 922 73 03 19;reservas@amarillagolf.es;https://www.amarillagolf.es/;28,0411;-16,6214
Anfi Tauro Golf;Carretera GC-520, km 64;Mogán;Las Palmas;Canarias;+34 928 56 04 62;golf@anfi.com;https://www.anfi.com/es/anfi-tauro/golf/;27,8286;-15,7117
Buenavista Golf;Finca La Burgada, s/n;Buenavista del Norte;Santa Cruz de Tenerife;Canarias;+34 922 12 90 34;info@buenavistagolf.es;https://www.buenavistagolf.es/;28,3811;-16,8583
Costa Adeje Golf;Finca de los Olivos, s/n;Adeje;Santa Cruz de Tenerife;Canarias;+34 922 71 00 00;info@golfcostaadeje.com;https://www.golfcostaadeje.com/;28,1061;-16,7583
El Cortijo Club de Campo;Autopista del Sur, GC-1, km 6.4;Telde;Las Palmas;Canarias;+34 928 71 11 11;info@elcortijo.es;https://www.elcortijo.es/;27,9944;-15,3964
Fuerteventura Golf Club;Carretera de Jandía, km 11;Antigua;Las Palmas;Canarias;+34 928 16 00 34;reservas@fuerteventuragolfclub.com;https://www.fuerteventuragolfclub.com/;28,3897;-13,8644
Golf del Sur;Av. J. M. Galván Bello, s/n;San Miguel de Abona;Santa Cruz de Tenerife;Canarias;+34 922 73 81 70;reservas@golfdelsur.es;https://www.golfdelsur.es/;28,0531;-16,6183
Golf Las Américas;Avda. Las Américas, s/n;Arona;Santa Cruz de Tenerife;Canarias;+34 922 75 20 05;info@golfresort-tenerife.com;https://www.golfresort-tenerife.com/;28,0736;-16,7192
Jandía Golf;Barranco de Vinamar, s/n;Pájara;Las Palmas;Canarias;+34 928 87 19 79;reservas@jandiagolf.com;https://www.jandiagolf.com/;28,0525;-14,3314
Lanzarote Golf;Carretera de Puerto del Carmen a Tías, km 2,5;Tías;Las Palmas;Canarias;+34 928 51 40 50;booking@lanzarotegolf.com;https://www.lanzarotegolf.com/;28,9328;-13,6394
Las Palmeras Golf;Avda. Doctor Alfonso Chiscano, s/n;Las Palmas de Gran Canaria;Las Palmas;Canarias;+34 928 22 23 24;info@laspalmerasgolf.es;https://www.laspalmerasgolf.es/;28,1258;-15,4419
Lopesan Meloneras Golf;Autopista GC-500, s/n;Maspalomas;Las Palmas;Canarias;+34 928 14 53 09;melonerasgolf@lopesan.com;https://www.lopesan.com/es/golf/meloneras-golf/;27,7381;-15,6119
Maspalomas Golf;Av. Touroperador Neckermann, s/n;Maspalomas;Las Palmas;Canarias;+34 928 76 25 81;reservas@maspalomasgolf.net;https://www.maspalomasgolf.net/;27,7517;-15,5919
Oasis Golf;Urb. La Mareta, s/n;Telde;Las Palmas;Canarias;+34 650 380 758;No disponible;No disponible;27,9625;-15,3853
Playitas Golf;Urb. Las Playitas, s/n;Tuineje;Las Palmas;Canarias;+34 928 86 04 00;info@playitas.net;https://www.playitas.net/es/deporte/golf;28,2239;-13,9878
Real Club de Golf de Las Palmas;Ctra. de Bandama, s/n;Santa Brígida;Las Palmas;Canarias;+34 928 35 01 04;info@realclubdegolfdelaspalmas.com;https://www.realclubdegolfdelaspalmas.com/;28,0317;-15,4519
Real Club de Golf de Tenerife;Calle Campo de Golf, 16;Tacoronte;Santa Cruz de Tenerife;Canarias;+34 922 63 66 07;info@rcgt.es;http://www.rcgt.es/;28,4917;-16,4119
Salinas de Antigua Golf Club;Carretera de Jandía, km 11;Caleta de Fuste;Las Palmas;Canarias;+34 928 16 00 34;recepcion@salinasgolf.com;http://www.salinasgolf.com/;28,3817;-13,8619
Tecina Golf;Lomada de Tecina, s/n;Playa de Santiago;Santa Cruz de Tenerife;Canarias;+34 922 14 59 50;tecina.golf@fredolsen.es;https://www.tecinagolf.com/;28,0217;-17,2019
Costa Teguise Golf;Avenida del Golf, s/n;Costa Teguise;Las Palmas;Canarias;+34 928 59 05 12;info@costateguisegolf.com;https://www.costateguisegolf.com/;29,0019;-13,5208
Centro de Golf Los Palos;Carretera de Guaza-Las Galletas, km 7;Arona;Santa Cruz de Tenerife;Canarias;+34 922 16 90 80;info@losplosgolf.net;https://www.losplosgolf.net/;28,0289;-16,6806
Real Golf de Pedreña;Av. de Severiano Ballesteros, s/n;Pedreña;Cantabria;Cantabria;+34 942 50 00 01;info@rgpedrena.es;http://www.rgpedrena.es/;43,4417;-3,7519
Santa Marina Golf;La Revilla, s/n;San Vicente de la Barquera;Cantabria;Cantabria;+34 942 71 21 78;info@golfsantamaria.com;http://www.golfsantamaria.com/;43,3717;-4,4019
Club de Golf Nestares;Carretera de Nestares a Reinosa, s/n;Nestares;Cantabria;Cantabria;+34 942 75 12 21;info@golfnestares.com;https://www.golfnestares.com/;43,0019;-4,1311
Club de Golf Mataleñas;Avda. del Faro, s/n;Santander;Cantabria;Cantabria;+34 942 39 03 38;info@golfmatalenas.com;http://www.golfmatalenas.com/;43,4811;-3,7844
Club de Golf Abra del Pas 'Celia Barquín';Barrio La Cotera, s/n;Mogro;Cantabria;Cantabria;+34 942 57 71 83;info@golfabradelpas.com;http://www.golfabradelpas.com/;43,4339;-3,9553
Campo de Golf Rovacías;Barrio de Rovacías, s/n;Comillas;Cantabria;Cantabria;+34 942 72 26 09;info@rovaciasgolf.com;https://www.rovaciasgolf.com/;43,3853;-4,2803
Club de Golf Villarias;Villarias, s/n;Villanueva de la Nía;Cantabria;Cantabria;+34 942 77 80 57;info@golfvillarias.com;http://www.golfvillarias.com/;43,1256;-4,0289
La Junquera;Barrio de la Junquera, s/n;Pedreña;Cantabria;Cantabria;+34 942 50 01 02;info@golfjunquera.com;https://www.golfjunquera.com/;43,4392;-3,7547
Golf Valdeluz;Calle Anillo, 1;Yebes;Guadalajara;Castilla-La Mancha;+34 949 20 00 24;info@golfvaldeluz.com;https://www.golfvaldeluz.com/;40,5842;-3,1092
Club de Golf Las Pinaillas;Carretera Nacional 322, Km 323,7;Albacete;Albacete;Castilla-La Mancha;+34 967 19 01 30;info@golflaspinaillas.com;https://www.golflaspinaillas.com/;39,0417;-1,8019
Layos Golf;Ctra. Toledo a Piedrabuena, km 18;Layos;Toledo;Castilla-La Mancha;+34 925 35 59 40;info@layosgolf.com;http://www.layosgolf.com/;39,7806;-4,1039
Palomarejos Golf;Ctra. de la Puebla de Montalbán, km 3.5;Talavera de la Reina;Toledo;Castilla-La Mancha;+34 925 72 10 60;info@palomarejosgolf.com;https://www.palomarejosgolf.com/;39,9417;-4,7819
Club de Golf Villar de Olalla;Carretera Cuenca-Albacete, N-320, km 134;Villar de Olalla;Cuenca;Castilla-La Mancha;+34 969 20 80 50;info@golfvillardeolalla.com;http://www.golfvillardeolalla.com/;40,0319;-2,2031
Golf Ciudad Real;Carretera de Porzuna, km 4,5;Ciudad Real;Ciudad Real;Castilla-La Mancha;+34 926 84 01 11;info@golfciudadreal.com;https://www.golfciudadreal.com/;39,0153;-3,9781
Abanades Golf;Urbanización El Señorío de los Abanades, s/n;Abánades;Guadalajara;Castilla-La Mancha;+34 609 01 02 03;No disponible;No disponible;40,9169;-2,4836
El Bonillo Club de Golf;Carretera de El Ballestero, km 1;El Bonillo;Albacete;Castilla-La Mancha;+34 629 55 45 61;No disponible;http://www.elbonillogolf.com/;38,9483;-2,5294
Cuenca Golf Club;Camino Cañada de la Moraleja, s/n;Villar de Olalla;Cuenca;Castilla-La Mancha;+34 639 15 28 85;info@cuencagolf.es;http://www.cuencagolf.es/;40,0325;-2,2033
Club de Golf de Soria;Finca La Buitraga, s/n;Pedrajas;Soria;Castilla y León;+34 975 27 10 75;info@golfsoria.com;http://www.golfsoria.com/;41,7431;-2,5317
Club de Golf de Lerma;Ctra. N-1, km 203;Lerma;Burgos;Castilla y León;+34 947 57 20 20;info@golflerma.com;http://www.golflerma.com/;42,0217;-3,7619
Salamanca Golf & Country Club;Ctra. de Salamanca a Vecinos, km 18;Zarapicos;Salamanca;Castilla y León;+34 923 32 90 00;info@salamancagolf.com;http://www.salamancagolf.com/;40,8917;-5,8319
Club de Golf de León;Camino de Villabúrbula, s/n;San Miguel del Camino;León;Castilla y León;+34 987 30 34 00;info@leongolf.es;https://www.leongolf.es/;42,5442;-5,7047
Aldeamayor Club de Golf;Ctra. CL-601, km 15;Aldeamayor de San Martín;Valladolid;Castilla y León;+34 983 55 80 80;info@golfaldeamayor.com;https://www.golfaldeamayor.com/;41,5281;-4,6592
Golf La Faisanera;Carretera N-603, km 83;Palazuelos de Eresma;Segovia;Castilla y León;+34 921 47 48 49;info@lafaisaneragolf.es;https://www.lafaisaneragolf.es/;40,9033;-4,0897
Club de Golf Grijota;Carretera de Becerril de Campos, s/n;Grijota;Palencia;Castilla y León;+34 979 76 77 75;info@golfgrijota.com;https://www.golfgrijota.com/;42,0392;-4,6022
Club de Golf de Béjar;Carretera de la Covatilla, s/n;La Covatilla;Salamanca;Castilla y León;+34 923 40 11 11;info@golfbejar.com;http://www.golfbejar.com/;40,3533;-5,6942
Club de Golf Entrepinos;Urb. Entrepinos, Calle del Golf, s/n;Simancas;Valladolid;Castilla y León;+34 983 59 01 80;info@golfentrepinos.com;http://www.golfentrepinos.com/;41,5956;-4,8142
Club de Golf Villamayor;Urb. Las Canteras, s/n;Villamayor;Salamanca;Castilla y León;+34 923 33 70 20;info@golfvillamayor.com;https://www.golfvillamayor.com/;41,0019;-5,6883
Riocerezo Golf;Carretera N-120, km 99;Riocerezo;Burgos;Castilla y León;+34 947 43 01 02;info@riocerezogolf.com;http://www.riocerezogolf.com/;42,3617;-3,5819
Saldaña Golf;N-620, Salida 13;Saldaña de Burgos;Burgos;Castilla y León;+34 947 28 80 00;info@saldanagolf.com;http://www.saldanagolf.com/;42,2717;-3,7319
El Fresnillo Golf;Carretera N-501, km 4,5;Ávila;Ávila;Castilla y León;+34 920 20 80 01;info@golfelfresnillo.com;https://www.golfelfresnillo.com/;40,6781;-4,6408
Club de Golf Candeleda;Ctra. de Candeleda a Madrigal de la Vera, km 1,5;Candeleda;Ávila;Castilla y León;+34 920 38 21 00;info@golfcandeleda.com;https://www.golfcandeleda.com/;40,1583;-5,2281
Club de Golf Los Ángeles de San Rafael;Av. de Venecia, 2;Los Ángeles de San Rafael;Segovia;Castilla y León;+34 921 17 40 50;golf@angelesdesanrafael.com;https://www.angelesdesanrafael.com/golf/;40,7519;-4,2156
Club de Golf El Bierzo;Congosto, s/n;Congosto;León;Castilla y León;+34 987 42 62 46;info@golfbierzo.com;https://www.golfbierzo.com/;42,5803;-6,4958
PGA Catalunya Golf and Wellness;Carretera N-II, km 701;Caldes de Malavella;Girona;Cataluña;+34 972 47 22 49;info@pgacatalunya.com;https://www.pgacatalunya.com/;41,8703;2,7758
Real Club de Golf El Prat;Plans de Bonvilar, 17;Terrassa;Barcelona;Cataluña;+34 937 28 10 00;info@rcgep.com;https://www.rcgep.com/;41,5383;2,0672
Infinitum Golf;Avinguda del Pla del Maset, s/n;Salou;Tarragona;Cataluña;+34 977 12 90 70;golf@infinitumliving.com;https://www.infinitumliving.com/golf;41,0817;1,1719
Club de Golf Barcelona;Carretera de Martorell a Capellades, km. 19.5;Sant Esteve Sesrovires;Barcelona;Cataluña;+34 937 72 88 00;info@golfbarcelona.com;https://www.golfbarcelona.com/;41,4883;1,8542
Club de Golf Llavaneras;Camí del Golf, s/n;Sant Andreu de Llavaneres;Barcelona;Cataluña;+34 937 92 60 50;info@golfllavaneras.com;https://www.golfllavaneras.com/;41,5683;2,4958
Club de Golf Terramar;Passeig Marítim, s/n;Sitges;Barcelona;Cataluña;+34 938 94 05 80;info@golfterramar.com;http://www.golfterramar.com/;41,2294;1,7892
Empordà Golf;Ctra. de Torroella de Montgrí a Pals, km. 34.5;Gualta;Girona;Cataluña;+34 972 76 04 50;info@empordagolf.com;https://www.empordagolf.com/;42,0253;3,1256
Club de Golf Vallromanes;Avinguda del Club de Golf, 1;Vallromanes;Barcelona;Cataluña;+34 935 72 90 64;info@clubdegolfvallromanes.com;https://www.clubdegolfvallromanes.com/;41,5283;2,2953
Club de Golf de Pals;Platja de Pals, s/n;Pals;Girona;Cataluña;+34 972 66 77 40;info@golfdepals.com;https://www.golfdepals.com/;41,9819;3,1958
Torremirona Golf Club;Ctra. N-260, km 46;Navata;Girona;Cataluña;+34 972 55 37 37;info@golftorremirona.com;https://www.golftorremirona.com/;42,2317;2,8619
Club de Golf Costa Brava;Urb. La Masía, s/n;Santa Cristina d'Aro;Girona;Cataluña;+34 972 83 71 52;info@golfcostabrava.com;https://www.golfcostabrava.com/;41,8017;2,9819
Club de Golf Bonmont;Urb. Terres Noves, Ctra. N-340, km 1136;Mont-roig del Camp;Tarragona;Cataluña;+34 977 81 81 40;info@bonmont.es;https://www.bonmont.es/;41,0306;0,9231
Club de Golf Peralada;Carrer de Rocabertí, s/n;Peralada;Girona;Cataluña;+34 972 53 82 87;golf@grupperalada.com;https://www.golfperalada.com/;42,3117;3,0119
Real Club de Golf Cerdanya;Av. de Prat, s/n;Puigcerdà;Girona;Cataluña;+34 972 88 43 20;info@rcgcerdanya.com;http://www.rcgcerdanya.com/;42,4217;1,9119
Club de Golf Montanyà;Finca L'Estany, s/n;El Brull;Barcelona;Cataluña;+34 938 84 01 70;info@golfmontanya.cat;https://www.golfmontanya.cat/;41,8153;2,3025
Club de Golf Sant Cugat;Calle Villà, 79;Sant Cugat del Vallès;Barcelona;Cataluña;+34 936 74 39 08;info@golfsantcugat.com;https://www.golfsantcugat.com/;41,4681;2,0919
Fontanals Golf Club;Urb. Fontanals de Cerdanya, s/n;Soriguerola;Girona;Cataluña;+34 972 89 00 89;info@fontanalsgolf.com;http://www.fontanalsgolf.com/;42,3811;1,8814
Golf La Roca;Ctra. Valldoriolf a Vilanova, km 2.5;La Roca del Vallès;Barcelona;Cataluña;+34 938 42 12 17;info@golflaroca.com;https://www.golflaroca.com/;41,6192;2,3161
Club de Golf Costa Dorada;Ctra. El Catllar, km 2.7;El Catllar;Tarragona;Cataluña;+34 977 65 33 61;info@golfcostadorada.com;https://www.golfcostadorada.com/;41,1783;1,3061
Club de Golf Aravell;Ctra. de la Seu d'Urgell a Andorra, km 5;Aravell;Lleida;Cataluña;+34 973 36 00 66;info@aravellgolf.com;https://www.aravellgolf.com/;42,3486;1,4550
Raimat Golf Club;Ctra. de Raimat, s/n;Lleida;Lleida;Cataluña;+34 973 73 73 70;info@raimatgolf.com;https://www.raimatgolf.com/;41,6669;0,5117
Golf d'Aro - Mas Nou;Urb. Mas Nou, s/n;Platja d'Aro;Girona;Cataluña;+34 972 81 67 27;info@golfdaro.com;https://www.golfdaro.com/;41,8342;3,0139
Club de Golf Reus Aigüesverds;Ctra. de Cambrils, km 5.2;Reus;Tarragona;Cataluña;+34 977 77 12 12;info@aiguesverds.com;https://www.aiguesverds.com/;41,1272;1,1042
Club de Golf Camprodon;Carretera de Sant Joan, s/n;Camprodon;Girona;Cataluña;+34 972 74 08 34;info@golfcamprodon.net;https://www.golfcamprodon.net/;42,3161;2,3686
Club de Golf Vilalba;Carretera de la Bisbal, GI-660, km 6;La Roca del Vallès;Barcelona;Cataluña;+34 606 31 16 28;info@vilalbagolf.com;https://www.vilalbagolf.com/;41,6181;2,3150
Club de Golf del Prat (ver Real Club de Golf El Prat);Plans de Bonvilar, 17;Terrassa;Barcelona;Cataluña;+34 937 28 10 00;info@rcgep.com;https://www.rcgep.com/;41,5383;2,0672
Can Cuyàs Golf;Parc de la Fontsanta, s/n;Sant Feliu de Llobregat;Barcelona;Cataluña;+34 936 85 55 56;info@cancuyasgolf.com;https://www.cancuyasgolf.com/;41,3739;2,0531
Golf La Graiera;Ctra. C-51, km 8;Calafell;Tarragona;Cataluña;+34 977 16 00 37;info@golfgraiera.com;https://www.golfgraiera.com/;41,2222;1,5794
Golf de Caldes;Finca el Espinar, C-59, km 18;Caldes de Montbui;Barcelona;Cataluña;+34 938 65 41 40;info@golfdecaldes.com;https://www.golfdecaldes.com/;41,6500;2,1800
Oller del Mas;Carretera de Igualada C-37z, km 90;Manresa;Barcelona;Cataluña;+34 938 74 81 52;golf@ollerdelmas.com;https://www.ollerdelmas.com/es/golf/;41,7139;1,7917
P&P Gualta;Ctra. Torroella de Montgrí a Parlavà, GI-643, km 1.5;Gualta;Girona;Cataluña;+34 972 75 54 86;info@gualta.com;https://www.gualta.com/;42,0236;3,1011
P&P Portal del Roc;Camí del Rocar, s/n;Vilanova i la Geltrú;Barcelona;Cataluña;+34 938 10 17 48;info@portaldelroc.com;https://www.portaldelroc.com/;41,2422;1,7289
P&P Vall d'Ordino;La Cortinada;Ordino;Andorra;Andorra;+376 749 300;info@valldordinogolf.com;https://www.valldordinogolf.com/;42,5761;1,5222
P&P El Vendrell;Carrer dels Ocells, 2;El Vendrell;Tarragona;Cataluña;+34 977 66 77 11;info@golfelvendrell.com;https://www.golfelvendrell.com/;41,2056;1,5233
P&P Can Pascual;Carretera de Sant Cugat, km 5;Sant Feliu de Llobregat;Barcelona;Cataluña;+34 936 66 11 36;info@canpascualgolf.com;https://www.canpascualgolf.com/;41,3883;2,0461
P&P Lleida;Partida de Torres de Sanui, s/n;Lleida;Lleida;Cataluña;+34 973 25 80 80;info@pplleida.com;https://www.pplleida.com/;41,6372;0,6031
Centro Nacional de Golf;Av. del Arroyo del Monte, 5;Madrid;Madrid;Comunidad de Madrid;+34 913 76 90 60;info@centronacionalgolf.com;https://www.centronacionalgolf.com/;40,4914;-3,7081
Club de Campo Villa de Madrid;Ctra. de Castilla, km 2;Madrid;Madrid;Comunidad de Madrid;+34 915 50 20 10;info@ccvm.es;https://www.ccvm.es/;40,4392;-3,7667
Golf Santander;Av. de la Ciudad de Santander, s/n;Boadilla del Monte;Madrid;Comunidad de Madrid;+34 912 57 39 00;infogolf@golfsantander.es;https://www.golfsantander.es/;40,3831;-3,9019
Real Sociedad Hípica Española Club de Campo;Ctra. de Burgos, A-1, km 26.4;San Sebastián de los Reyes;Madrid;Comunidad de Madrid;+34 916 57 02 41;info@rshecc.es;https://www.rshecc.es/;40,5847;-3,5786
Club de Golf La Moraleja;Paseo de la Marquesa Viuda de Aldama, 50;Alcobendas;Madrid;Comunidad de Madrid;+34 916 50 07 00;info@golflamoraleja.com;https://www.golflamoraleja.com/;40,5217;-3,6319
Real Club de la Puerta de Hierro;Av. de Miraflores, s/n;Madrid;Madrid;Comunidad de Madrid;+34 913 16 17 45;info@rcph.es;https://www.rcph.es/;40,4617;-3,7519
Club de Golf Lomas-Bosque;Urb. Lomas del Bosque, Av. del Monte, s/n;Villaviciosa de Odón;Madrid;Comunidad de Madrid;+34 916 16 23 88;info@lomas-bosque.com;https://www.lomas-bosque.com/;40,3800;-3,9000
Club de Golf Retamares;Ctra. de Burgos, A-1, Salida 26;Alalpardo;Madrid;Comunidad de Madrid;+34 916 20 42 40;info@retamaresgolf.com;https://www.retamaresgolf.com/;40,5817;-3,4919
Club de Golf La Herrería;Av. del Palacio, s/n;San Lorenzo de El Escorial;Madrid;Comunidad de Madrid;+34 918 90 51 11;info@golflaherreria.com;https://www.golflaherreria.com/;40,5817;-4,1419
La Dehesa Golf;Camino de la Dehesa, s/n;Villanueva de la Cañada;Madrid;Comunidad de Madrid;+34 918 15 70 74;info@golfdehesa.es;https://www.golfdehesa.es/;40,4319;-3,9856
Golf Park;Camino del Tiro de Pichón, s/n;Madrid;Madrid;Comunidad de Madrid;+34 913 16 29 16;info@golfpark.es;https://www.golfpark.es/;40,5019;-3,6919
Nuevo Club de Golf de Madrid;Ctra. de La Coruña, km 26.5;Las Rozas de Madrid;Madrid;Comunidad de Madrid;+34 916 30 08 20;info@nuevoclubgolfmadrid.com;https://www.nuevoclubgolfmadrid.com/;40,5217;-3,8919
El Robledal Golf;Urb. El Robledal, s/n;Villalbilla;Madrid;Comunidad de Madrid;+34 918 85 91 18;info@elrobledalgolf.com;https://www.elrobledalgolf.com/;40,4436;-3,3325
Encín Golf Hotel;Autovía A-2, km 35.6;Alcalá de Henares;Madrid;Comunidad de Madrid;+34 918 30 70 77;info@encingolf.com;https://www.encingolf.com/;40,5211;-3,3133
Club de Golf Aranjuez;Ctra. de Andalucía, A-4, km 44.5;Aranjuez;Madrid;Comunidad de Madrid;+34 918 91 14 00;info@golfaranjuez.com;https://www.golfaranjuez.com/;40,0531;-3,6319
Green Paddock;Av. de la Abadía, s/n;Torrelodones;Madrid;Comunidad de Madrid;+34 918 59 10 39;info@greenpaddock.com;https://www.greenpaddock.com/;40,5694;-3,9189
Golf Negralejo;Ctra. de San Fernando a Mejorada, M-203, km 5.5;Rivas-Vaciamadrid;Madrid;Comunidad de Madrid;+34 916 71 30 30;info@negralejogolf.com;https://www.negralejogolf.com/;40,3817;-3,5219
Las Rejas;C/ Veleta, 26;Majadahonda;Madrid;Comunidad de Madrid;+34 916 39 30 40;info@golfpublico.com;https://www.golfpublico.com/;40,4731;-3,8447
Centro de Tecnificación de Golf;Ctra. del Pardo, M-605, km 2.7;Madrid;Madrid;Comunidad de Madrid;+34 913 76 87 73;carlos.debarra@fedgolfmadrid.com;https://www.fedgolfmadrid.com/instalaciones/centro-de-tecnificacion/;40,4858;-3,7553
Olivar de la Hinojosa;Av. de Dublín, s/n;Madrid;Madrid;Comunidad de Madrid;+34 917 21 18 89;info@golfolivar.com;https://www.golfolivar.com/;40,4619;-3,6061
Barberán y Collar;Base Aérea de Cuatro Vientos;Madrid;Madrid;Comunidad de Madrid;+34 915 09 52 00;info.golfbarberan@gmail.com;http://www.golfbarberan.com/;40,3683;-3,7853
Golf Suites;Av. de los Poblados, 153;Madrid;Madrid;Comunidad de Madrid;+34 915 09 90 90;info@golfsuites.es;https://www.golfsuites.es/;40,3703;-3,7314
Escuela de Golf El Estudiante;C/ del Alto, s/n;Alcobendas;Madrid;Comunidad de Madrid;+34 916 61 03 34;info@escuelagolfelestudiante.com;https://www.escuelagolfelestudiante.com/;40,5408;-3,6492
La Moraleja 3 y 4 (ver Club de Golf La Moraleja);C/ del Camino Ancho, 2;Algete;Madrid;Comunidad de Madrid;+34 916 50 07 00;info@golflamoraleja.com;https://www.golflamoraleja.com/;40,5956;-3,5658
Somosaguas;Urb. Somosaguas, s/n;Pozuelo de Alarcón;Madrid;Comunidad de Madrid;+34 913 52 20 00;info@golfsomosaguas.com;https://www.golfsomosaguas.com/;40,4181;-3,8058
Forus Las Rejas (ver Las Rejas);C/ Veleta, 26;Majadahonda;Madrid;Comunidad de Madrid;+34 916 39 30 40;info@golfpublico.com;https://www.golfpublico.com/;40,4731;-3,8447
Club de Golf Pablo Hernández;Avda. de los Almendros s/n;Novés;Toledo;Castilla-La Mancha;+34 659 05 91 11;info@golfpablohernandez.com;http://www.golfpablohernandez.com/;40,0558;-4,3142
Golf Navaluenga;Ctra. de Madrid, 46;Navaluenga;Ávila;Castilla y León;+34 918 64 61 14;info@golfnavaluenga.com;https://www.golfnavaluenga.com/;40,4117;-4,7003
Club de Golf Castillo de Gorraiz;Av. de Egüés, 26;Gorraiz;Navarra;Comunidad Foral de Navarra;+34 948 33 60 74;info@golfgorraiz.com;https://www.golfgorraiz.com/;42,8286;-1,5833
Club de Golf Ulzama;Urb. de Guerendiáin, s/n;Guerendiáin;Navarra;Comunidad Foral de Navarra;+34 948 30 51 62;info@golfultzama.com;https://www.golfultzama.com/;42,9417;-1,6719
Señorío de Zuasti;Parque de Zuasti, s/n;Zuasti;Navarra;Comunidad Foral de Navarra;+34 948 30 46 66;info@zuasti.com;https://www.zuasti.com/golf/;42,8719;-1,7214
Lizaso Golf;Polígono 1, Parcela 23;Lizaso;Navarra;Comunidad Foral de Navarra;+34 650 78 78 78;info@lizasogolf.com;http://www.lizasogolf.com/;42,9786;-1,7061
Parador & Golf El Saler;Av. de los Pinares, 151;El Saler;Valencia;Comunitat Valenciana;+34 961 61 11 86;saler.golf@parador.es;https://paradores.es/es/parador-de-el-saler;39,3639;-0,3236
Las Colinas Golf & Country Club;Av. de las Colinas, 2;Orihuela Costa;Alicante;Comunitat Valenciana;+34 965 32 40 04;golf@lascolinasgolf.es;https://www.lascolinasgolf.com/;37,9103;-0,8119
Club de Golf Escorpión;Urb. Torre en Conill, s/n;Bétera;Valencia;Comunitat Valenciana;+34 961 60 12 11;info@escorpiongolf.com;https://www.escorpiongolf.com/;39,5761;-0,4686
La Galiana Golf Resort;Carretera Alzira-Tavernes CV-50, km 11;Carcaixent;Valencia;Comunitat Valenciana;+34 961 10 39 39;info@lagalianagolf.com;https://www.lagalianagolf.com/;39,1133;-0,3472
Villaitana Golf;Av. Alcalde Eduardo Zaplana, 7;Benidorm;Alicante;Comunitat Valenciana;+34 966 81 30 13;golf.villaitana@melia.com;https://www.melia.com/es/hoteles/espana/benidorm/melia-villaitana/golf.htm;38,5617;-0,1419
La Finca Golf;Ctra. Algorfa-Los Montesinos, km 3;Algorfa;Alicante;Comunitat Valenciana;+34 966 72 90 10;golf@lafincaresort.com;https://www.lafincaresort.com/golf/la-finca-golf;38,0617;-0,7919
Club de Golf El Bosque;Urb. El Bosque, Calle 23, 24;Chiva;Valencia;Comunitat Valenciana;+34 961 80 80 00;info@elbosquegolf.com;https://www.elbosquegolf.com/;39,4319;-0,6019
Panorámica Golf Resort;Urb. Panorámica, s/n;Sant Jordi;Castellón;Comunitat Valenciana;+34 964 49 30 72;info@panoramicagolf.com;https://www.panoramicagolf.com/;40,5217;0,4419
La Sella Golf;Partida Alquería de Ferrando, s/n;Dénia;Alicante;Comunitat Valenciana;+34 966 45 40 54;lasella.golf@deniamarriott.com;https://www.lasellagolf.com/es/;38,8017;0,0819
Alicante Golf;Av. de las Naciones, s/n;Alicante;Alicante;Comunitat Valenciana;+34 965 15 20 43;reservas@alicantegolf.com;https://www.alicantegolf.com/;38,3719;-0,4181
Font del Llop Golf Resort;Ctra. Monforte-Agost, km 2.5;Monforte del Cid;Alicante;Comunitat Valenciana;+34 966 12 67 67;info@fontdelllop.com;https://www.fontdelllop.com/;38,3794;-0,6656
Club de Golf Oliva Nova;Urb. Oliva Nova, s/n;Oliva;Valencia;Comunitat Valenciana;+34 962 85 76 66;golf@olivanova.com;https://www.olivanova.com/golf;38,9011;-0,0544
Las Ramblas Golf;Ctra. Villamartín-La Zenia, km 7;Orihuela Costa;Alicante;Comunitat Valenciana;+34 966 77 47 28;info@golfquara.com;https://www.golfquara.com/las-ramblas-golf.html;37,9317;-0,7619
Villamartín Golf;Ctra. de Villamartín a La Zenia, km 7;Orihuela Costa;Alicante;Comunitat Valenciana;+34 966 76 51 70;info@golfquara.com;https://www.golfquara.com/villamartin-golf.html;37,9417;-0,7719
Lo Romero Golf;Ctra. de Orihuela a Pilar de la Horadada, CV-925;Pilar de la Horadada;Alicante;Comunitat Valenciana;+34 966 76 68 87;info@loromerogolf.com;https://www.loromerogolf.com/;37,8917;-0,8219
Vistabella Golf;Ctra. CV-945, Urb. Vistabella Golf;Jacarilla;Alicante;Comunitat Valenciana;+34 966 10 78 46;info@vistabellagolf.com;https://www.vistabellagolf.com/;38,0117;-0,8419
Alenda Golf;Autovía A-31, km 15;Monforte del Cid;Alicante;Comunitat Valenciana;+34 965 62 05 21;info@alendagolf.com;https://alendagolf.com/;38,3583;-0,6403
Bonalba Golf Resort;Carrer del Vespre, 6;Mutxamel;Alicante;Comunitat Valenciana;+34 965 95 59 55;reservas@golfbonalba.com;https://www.golfbonalba.com/;38,4239;-0,4358
El Plantío Golf Resort;Ctra. Antigua Alicante-Elche, km 3;Elche;Alicante;Comunitat Valenciana;+34 965 11 50 49;info@elplantio.com;https://www.elplantio.com/;38,3031;-0,5519
Club de Golf Jávea;Ctra. Jávea-Benitachell, km 4.5;Jávea;Alicante;Comunitat Valenciana;+34 965 79 25 89;info@clubdegolfjavea.com;https://www.clubdegolfjavea.com/;38,7619;0,1658
Club de Golf Ifach;Urb. San Jaime, Calle Micheta, 5;Benissa;Alicante;Comunitat Valenciana;+34 966 49 71 14;info@golfifach.com;https://www.golfifach.com/;38,6942;0,0769
Foressos Golf;Ctra. de Alborache, CV-425, km 4.2;Picassent;Valencia;Comunitat Valenciana;+34 961 22 16 60;info@foressosgolf.com;https://www.foressosgolf.com/;39,3517;-0,4783
Club de Golf Manises;Carretera de Riba-roja, km 4;Manises;Valencia;Comunitat Valenciana;+34 961 52 38 04;info@golfmanises.com;http://www.golfmanises.com/;39,4931;-0,4933
Club de Golf Costa de Azahar;Avda. del Mar, s/n;Grao de Castellón;Castellón;Comunitat Valenciana;+34 964 28 08 36;info@golfcostaazahar.com;https://www.golfcostaazahar.com/;39,9708;-0,0164
Club de Campo del Mediterráneo;Urb. La Coma, s/n;Borriol;Castellón;Comunitat Valenciana;+34 964 32 12 27;info@mediterraneogolf.com;https://www.mediterraneogolf.com/;40,0381;-0,0319
Norba Club de Golf;Ctra. de Badajoz, km 2;Cáceres;Cáceres;Extremadura;+34 927 23 23 12;info@norbagolf.com;https://www.norbagolf.com/;39,4617;-6,4019
Talayuela Golf;Ctra. de la Vera, s/n;Talayuela;Cáceres;Extremadura;+34 927 55 10 00;info@talayuelagolf.com;http://www.talayuelagolf.com/;40,0117;-5,6019
Golf Guadiana;Urb. Guadiana, s/n;Badajoz;Badajoz;Extremadura;+34 924 44 47 00;info@golfguadiana.es;http://www.golfguadiana.es/;38,9214;-6,9119
Don Tello Golf;Ctra. de Mérida a Alange, km 8;Mérida;Badajoz;Extremadura;+34 924 32 80 50;info@dontellogolf.com;http://www.dontellogolf.es/;38,8681;-6,3533
Real Club de Golf de La Coruña;Ctra. de la Zapateira, s/n;A Coruña;A Coruña;Galicia;+34 981 28 52 00;info@golfcoruna.com;http://www.golfcoruna.com/;43,3217;-8,4019
Oca Augas Santas Balneario & Golf Resort;Lugar de As Chavolas, s/n;Pantón;Lugo;Galicia;+34 982 45 67 05;info@augassantas.es;https://www.augassantas.es/es/golf;42,5694;-7,6192
Balneario de Mondariz;Av. Enrique Peinador, s/n;Mondariz-Balneario;Pontevedra;Galicia;+34 986 65 61 56;golf@balneariodemondariz.com;https://balneariodemondariz.com/golf/;42,2231;-8,4619
Club de Golf de Meis;Lugar de Silván, s/n;Meis;Pontevedra;Galicia;+34 986 71 50 50;info@golfmeis.com;http://www.golfmeis.com/;42,4917;-8,7019
Real Aero Club de Vigo;Av. do Aeroporto, 403;Vigo;Pontevedra;Galicia;+34 986 20 00 32;info@racvigo.com;https://www.racvigo.com/;42,2197;-8,6319
Hércules Club de Golf;Ctra. de la Barna, s/n;Arteixo;A Coruña;Galicia;+34 981 64 09 00;info@herculesgolf.com;https://www.herculesgolf.com/;43,3083;-8,4981
Club de Golf Val de Rois;Lugar de las Aves, s/n;Rois;A Coruña;Galicia;+34 981 81 22 00;info@golfvalderois.com;http://www.golfvalderois.com/;42,7617;-8,6919
Club de Golf Lugo;Lugar de Santa Marta de Fixós, s/n;Lugo;Lugo;Galicia;+34 982 17 62 14;info@golflugo.com;https://www.golflugo.com/;42,9836;-7,5408
Miño-Vilar de Rabade;Lugar de Vilar de Rabade, s/n;Miño;A Coruña;Galicia;+34 981 77 70 17;info@golfmino.com;http://www.golfmino.com/;43,3061;-8,2319
Montealegre Club de Golf;Lugar de Montealegre, s/n;Ourense;Ourense;Galicia;+34 988 25 90 92;info@montealegreclubdegolf.es;https://www.montealegreclubdegolf.es/;42,3614;-7,8483
Club de Golf Alcanada;Carretera del Faro, s/n;Port d'Alcúdia;Illes Balears;Illes Balears;+34 971 54 95 60;info@golf-alcanada.com;https://www.golf-alcanada.com/;39,8453;3,1594
Golf Son Gual;Finca Son Gual, Ma-15, km 11.5;Palma de Mallorca;Illes Balears;Illes Balears;+34 971 78 58 88;info@son-gual.com;https://www.son-gual.com/es/;39,5717;2,7919
Golf de Andratx;C/ Cromlec, 1;Camp de Mar;Illes Balears;Illes Balears;+34 971 23 62 80;info@golfdeandratx.com;https://www.golfdeandratx.com/;39,5442;2,4217
Son Muntaner Golf;C/ de la Vileta, 34;Palma de Mallorca;Illes Balears;Illes Balears;+34 971 78 30 30;golf.mallorca@arabellagolf.com;https://www.sonmuntanergolf.com/es/;39,5917;2,6019
T-Golf Palma (antes Poniente);Ctra. Cala Figuera, s/n;Calvià;Illes Balears;Illes Balears;+34 971 13 01 48;info@t-golf.club;https://www.t-golf.club/;39,5108;2,5369
Real Golf de Bendinat;Calle Campoamor, 3;Calvià;Illes Balears;Illes Balears;+34 971 40 52 00;info@realgolfbendinat.com;https://www.realgolfbendinat.com/;39,5392;2,5767
Capdepera Golf;Ctra. Artà-Capdepera, km 3.5;Capdepera;Illes Balears;Illes Balears;+34 971 81 85 00;info@golfcapdepera.com;https://www.golfcapdepera.com/;39,7156;3,4003
Canyamel Golf;Av. d'es Cap Vermell, 1;Canyamel;Illes Balears;Illes Balears;+34 971 84 13 13;canyamelgolf@grupo-serra.com;https://www.canyamelgolf.com/;39,6644;3,4336
Golf Son Servera;Urb. Costa de los Pinos, s/n;Son Servera;Illes Balears;Illes Balears;+34 971 84 00 96;info@golfsonservera.com;https://www.golfsonservera.com/;39,6717;3,3719
Golf Santa Ponsa;C/ Golf, s/n;Santa Ponsa;Illes Balears;Illes Balears;+34 971 69 02 11;info@golf-santaponsa.com;https://www.golf-santaponsa.com/;39,5317;2,4853
Golf Son Vida;C/ de la Vileta, 5;Palma de Mallorca;Illes Balears;Illes Balears;+34 971 79 12 10;sonvida.golf@arabellagolf.com;https://www.sonvidagolf.com/;39,5917;2,6019
Pula Golf Resort;Ctra. Son Servera a Capdepera, km 3;Son Servera;Illes Balears;Illes Balears;+34 971 81 70 34;info@pulagolf.com;https://www.pulagolf.com/;39,6917;3,3919
Marriott Golf Son Antem;Ctra. MA-19, Salida 20;Llucmajor;Illes Balears;Illes Balears;+34 971 12 92 00;info.sonantem@autographhotels.com;https://www.sonantem.es/;39,4917;2,8719
Golf Ibiza;Ctra. de Jesús a Cala Llonga, s/n;Santa Eulària des Riu;Illes Balears;Illes Balears;+34 971 19 60 52;info@golfibiza.com;https://www.golfibiza.com/;38,9419;1,4883
Golf Son Termes;Ctra. de S'Esgleieta a Santa María, km 10;Bunyola;Illes Balears;Illes Balears;+34 971 61 78 62;info@golfsontermens.com;https://www.golfsontermens.com/;39,6717;2,6419
Golf Park Mallorca Puntiró;Ctra. de Sineu, km 10;Palma de Mallorca;Illes Balears;Illes Balears;+34 971 79 73 13;info@golfparkmallorca.com;http://www.golfparkmallorca.com/;39,6117;2,7719
Golf Pollensa;Ctra. Palma-Pollença, km 49.3;Pollença;Illes Balears;Illes Balears;+34 971 53 32 16;info@golfpollensa.com;https://www.golfpollensa.com/;39,8703;3,0531
Golf Son Gual;MA 15 Palma-Manacor, Km 11,5;Palma de Mallorca;Illes Balears;Illes Balears;+34 971 78 58 88;info@son-gual.com;https://www.son-gual.com/es/;39,5714;2,7919
Club de Campo Sojuela;Ctra. de Soria, N-111, km 8;Sojuela;La Rioja;La Rioja;+34 941 44 67 00;info@golfsojuela.com;http://www.golfsojuela.com/;42,3617;-2,5719
Rioja Alta Golf Club;Ctra. de Haro a Santo Domingo, LR-201;Cirueña;La Rioja;La Rioja;+34 941 34 08 95;info@golfriojaalta.com;https://www.golfriojaalta.com/;42,4417;-2,8719
Campo de Golf de Logroño;Parque de la Grajera, Ctra. de Burgos, Km. 2;Logroño;La Rioja;La Rioja;+34 941 51 13 60;info@golflogrono.es;https://www.golflogrono.es/;42,4492;-2,4864
Real Sociedad de Golf de Neguri;Paseo del Faro, s/n;Getxo;Bizkaia;País Vasco;+34 944 91 03 00;info@rsgneguri.com;http://www.rsgneguri.com/;43,3617;-3,0319
Real Club de Golf de San Sebastián;Jaizkibel, s/n;Hondarribia;Gipuzkoa;País Vasco;+34 943 61 68 45;info@golfjaizkibel.com;http://www.golfjaizkibel.com/;43,3417;-1,8219
Laukariz Club de Campo;Urb. Laukariz, Av. del Club, 1;Mungia;Bizkaia;País Vasco;+34 946 74 01 52;info@laukariz.com;https://www.laukariz.com/;43,3153;-2,8631
Club de Golf Larrabea;Ctra. Gopegi-Ondategi, A-3610;Legutio;Álava;País Vasco;+34 945 46 51 02;info@larrabea.com;https://www.larrabea.com/;42,9692;-2,7303
Izki Golf;Urturi, s/n;Urturi;Álava;País Vasco;+34 945 37 82 58;info@izkigolf.com;https://www.izkigolf.com/;42,6961;-2,4819
Real Nuevo Club de Golf Basozabal;Camino de Goyaz Txiki, 41;San Sebastián;Gipuzkoa;País Vasco;+34 943 33 00 33;info@golfbasozabal.com;http://www.golfbasozabal.com/;43,2861;-1,9833
Meaztegi Golf;La Arboleda, s/n;Ortuella;Bizkaia;País Vasco;+34 946 36 43 70;info@meaztegigolf.com;https://www.meaztegigolf.com/;43,2989;-3,0614
Real Club de Golf de Zarauz;Playa de Zarauz, s/n;Zarautz;Gipuzkoa;País Vasco;+34 943 83 01 45;info@golfzarauz.com;http://www.golfzarauz.com/;43,2917;-2,1619
La Manga Club;Los Belones, s/n;Cartagena;Murcia;Región de Murcia;+34 968 17 50 00;info@lamangaclub.com;https://lamangaclub.com/es/golf;37,6019;-0,8119
Las Colinas Golf & Country Club;Av. de las Colinas, 2;San Miguel de Salinas (Alicante);Alicante;Región de Murcia;+34 965 32 40 04;golf@lascolinasgolf.es;https://www.lascolinasgolf.com/;37,9103;-0,8119
Roda Golf & Beach Resort;Ctra. de San Cayetano, s/n;San Javier;Murcia;Región de Murcia;+34 968 17 30 93;golf@rodagolf.com;https://www.rodagolf.com/es/;37,7817;-0,8719
Hacienda del Álamo Golf Resort;Av. Hacienda del Álamo, 13;Fuente Álamo;Murcia;Región de Murcia;+34 968 15 72 36;info@hdagolf.com;https://www.hdagolf.com/;37,7558;-1,1831
Mar Menor Golf;C/ Ceiba, s/n, Torre-Pacheco;Torre-Pacheco;Murcia;Región de Murcia;+34 968 04 17 65;info@irmgolf.com;https://www.gnkgolf.com/campos/mar-menor;37,7472;-0,9708
Saurines de la Torre;Ctra. de Avileses, Sucina;Torre-Pacheco;Murcia;Región de Murcia;+34 968 03 23 80;info@irmgolf.com;https://www.gnkgolf.com/campos/saurines;37,8931;-1,0119
La Torre Golf;C/ Ancha, 1;Roldán;Murcia;Región de Murcia;+34 968 03 23 70;info@irmgolf.com;https://www.gnkgolf.com/campos/la-torre;37,8383;-1,0103
Hacienda Riquelme Golf;Sucina, s/n;Sucina;Murcia;Región de Murcia;+34 968 03 80 51;info@irmgolf.com;https://www.gnkgolf.com/campos/hacienda-riquelme;37,8867;-1,0425
El Valle Golf;C/ Calasparra, 1;Baños y Mendigo;Murcia;Región de Murcia;+34 968 03 30 08;info@irmgolf.com;https://www.gnkgolf.com/campos/el-valle;37,8686;-1,1217
Alhama Signature Golf;Condado de Alhama, s/n;Alhama de Murcia;Murcia;Región de Murcia;+34 968 32 80 08;info@irmgolf.com;https://www.gnkgolf.com/campos/alhama-signature;37,7117;-1,3556
Club de Golf Altorreal;Av. del Golf, s/n;Molina de Segura;Murcia;Región de Murcia;+34 968 64 81 44;info@golfaltorreal.es;https://www.golfaltorreal.es/;38,0583;-1,1969
Lorca Golf Resort;Urb. Lorca Golf Resort, Ctra. de Águilas;Lorca;Murcia;Región de Murcia;+34 968 11 35 35;info@lorcaresort.com;https://lorcaresort.com/es/golf-en-lorca/;37,5683;-1,6569
New Sierra Golf;Balsicas, s/n;Balsicas;Murcia;Región de Murcia;+34 628 12 34 33;newsierragolf@gmail.com;https://www.newsierragolf.com/;37,8186;-0,9508
Camposol Club de Golf;Sector C, Urb. Camposol;Mazarrón;Murcia;Región de Murcia;+34 968 10 13 36;golfclubcamposol@gmail.com;http://www.camposolclubdegolf.com/;37,6483;-1,4239
Águilas Club de Golf (Cerrado);Ctra. de Calabardina, s/n;Águilas;Murcia;Región de Murcia;No disponible;No disponible;No disponible;37,4083;-1,6192`;

const parseCoursesCSV = (csv: string): GolfCourse[] => {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].split(';').map(h => h.trim());
  const courses: GolfCourse[] = [];

  const provinceNormalizationMap: { [key: string]: string } = {
      'Vizcaya': 'Bizkaia',
      'Guipúzcoa': 'Gipuzkoa',
      'Álava': 'Álava',
      'Islas Baleares': 'Illes Balears',
      'Comunidad Valenciana': 'Comunitat Valenciana'
  };

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';');
    if (values.length !== header.length) continue;

    const courseData: { [key: string]: string | null } = {};
    header.forEach((key, index) => {
        const value = values[index].trim();
        courseData[key] = value === 'No disponible' ? null : value;
    });

    const name = courseData.name;
    if (!name) continue;

    const province = courseData.province;
    const normalizedProvince = province ? (provinceNormalizationMap[province] || province) : null;
    
    const course: GolfCourse = {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: name,
      address: courseData.address,
      municipality: courseData.municipality,
      province: normalizedProvince,
      region: courseData.region,
      phone: courseData.phone,
      email: courseData.email,
      url: courseData.url,
      latitude: courseData.latitude ? courseData.latitude.replace(',', '.') : null,
      longitude: courseData.longitude ? courseData.longitude.replace(',', '.') : null,
    };
    courses.push(course);
  }
  return courses;
};


export const GOLF_COURSES_DATA = parseCoursesCSV(coursesCSV);
