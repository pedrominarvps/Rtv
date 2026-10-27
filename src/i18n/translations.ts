export type SupportedLanguage = 'es' | 'es-ES' | 'en' | 'pt';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  region: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'es', label: 'Español (Latinoamérica)', region: 'Latinoamérica', badge: 'ES' },
  { code: 'es-ES', label: 'Español (España)', region: 'España', badge: 'ES' },
  { code: 'en', label: 'English (United States)', region: 'United States', badge: 'EN' },
  { code: 'pt', label: 'Português (Brasil)', region: 'Brasil', badge: 'PT' },
];

export const translations = {
  es: {
    // Navigation
    'nav.home': 'RukaTV+',
    'nav.tvSeason': 'TV Season',
    'nav.upNext': 'Mi Lista',
    'nav.search': 'Buscar',
    'nav.signIn': 'Iniciar sesión',
    'nav.searchPlaceholder': 'Buscar películas, series...',

    // Hero / Actions
    'hero.original': 'Ruka Original',
    'hero.streamNow': 'Reproducir',
    'hero.addToUpNext': 'Agregar a Mi Lista',
    'hero.inUpNext': 'En Mi Lista',
    'hero.moreInfo': 'Más información',

    // Shelves
    'shelf.upNextTitle': 'Continuar viendo',
    'shelf.upNextSubtitle': 'Retoma donde lo dejaste',
    'shelf.topTenTitle': 'Top 10 en RukaTV',
    'shelf.topTenSubtitle': 'Lo más visto esta semana',
    'shelf.moviesTitle': 'Películas taquilleras',
    'shelf.moviesSubtitle': 'Disfruta de grandes éxitos en 4K UHD y Dolby Atmos',
    'shelf.seriesTitle': 'Series y dramas destacados',
    'shelf.seriesSubtitle': 'Disfruta temporadas completas y episodios exclusivos',
    'shelf.liveChannelsTitle': 'Canales de TV en vivo',
    'shelf.liveChannelsSubtitle': 'Deportes, noticias y transmisiones 24/7',
    'shelf.featuredCinemaTitle': 'Cine y acción destacados',
    'shelf.featuredCinemaSubtitle': 'Películas aclamadas por la crítica en 4K',
    'shelf.live': 'EN VIVO',
    'shelf.original': 'Original',

    // Details Page
    'detail.back': 'Volver',
    'detail.streamNow': 'Reproducir ahora',
    'detail.play': 'Reproducir',
    'detail.addToUpNext': 'Agregar a Mi Lista',
    'detail.inUpNext': 'En Mi Lista',
    'detail.share': 'Compartir',
    'detail.linkCopied': 'Enlace copiado',
    'detail.overview': 'Sinopsis',
    'detail.starring': 'Reparto principal',
    'detail.direction': 'Dirección y estudio',
    'detail.capabilities': 'Calidad de audio y video',
    'detail.episodes': 'Episodios',
    'detail.season': 'Temporada',
    'detail.episode': 'Episodio',
    'detail.loadingEpisodes': 'Cargando episodios del servidor...',
    'detail.moreToWatch': 'Más para ver',
    'detail.similar': 'Títulos similares que te podrían gustar',
    'detail.notFoundTitle': 'Título no encontrado',
    'detail.notFoundDesc': 'El contenido que buscas no está disponible en el catálogo actual.',
    'detail.backHome': 'Volver al Inicio',
    'detail.loading': 'Cargando detalles de RukaTV+...',

    // TV Season / Live
    'tv.liveBadge': 'En vivo 24/7 en RukaTV+',
    'tv.watchChannel': 'Ver canal',
    'tv.header': 'Canales de TV Season en vivo',
    'tv.desc': 'Transmisión continua directa desde el servidor.',
    'tv.available': 'Canales disponibles',
    'tv.all': 'Todos',
    'tv.sports': 'Deportes',
    'tv.news': 'Noticias',
    'tv.entertainment': 'Entretenimiento',
    'tv.movies': 'Películas',
    'tv.emptyTitle': 'No hay canales disponibles',
    'tv.emptyDesc': 'Verifica la conexión con el servidor Xtream Code.',

    // Up Next / Watchlist
    'upnext.title': 'Mi Lista',
    'upnext.subtitle': 'Tu lista personal sincronizada en todos tus dispositivos RukaTV.',
    'upnext.continue': 'Continuar viendo',
    'upnext.saved': 'Guardado en Mi Lista',
    'upnext.emptyTitle': 'Tu lista está vacía',
    'upnext.emptyDesc': 'Explora Ruka Originals, películas y series para agregarlas a tu lista.',
    'upnext.explore': 'Explorar contenidos',

    // Search Page
    'search.title': 'Buscar',
    'search.subtitle': 'Explora películas, series, actores y canales en vivo 24/7.',
    'search.placeholder': 'Buscar películas, series, actores o géneros...',
    'search.found': 'títulos encontrados',
    'search.showing': 'Mostrando resultados para',
    'search.noResultsTitle': 'No se encontraron resultados',
    'search.noResultsDesc': 'Comprueba la ortografía o intenta buscar en otra categoría.',
    'search.loading': 'Buscando en el catálogo...',

    // Footer
    'footer.tagline': 'Ruka Originals y Entretenimiento en Vivo',
    'footer.disclaimer1': '1. Se requiere hardware y software compatible. La transmisión 4K UHD, HDR10 y Dolby Atmos está sujeta a las capacidades del dispositivo y velocidad de conexión.',
    'footer.disclaimer2': '2. Las marcas comerciales de TV Season son propiedad de sus respectivos operadores. Todos los derechos reservados.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de privacidad',
    'footer.terms': 'Términos de uso',
    'footer.sales': 'Ventas y reembolsos',
    'footer.legal': 'Legal',
    'footer.support': 'Soporte',

    // Language Modal
    'langModal.title': 'Seleccionar región e idioma',
    'langModal.subtitle': 'Elige el idioma preferido para la interfaz de RukaTV+.',
    'langModal.current': 'Idioma actual',
    'langModal.close': 'Cerrar',

    // Connection Error
    'error.title': 'No se pudo cargar el catálogo',
    'error.desc': 'Verifica la conexión con el servidor Xtream Code en .env o el estado de tu red.',
    'error.retry': 'Reintentar conexión',
  },

  'es-ES': {
    // Navigation
    'nav.home': 'RukaTV+',
    'nav.tvSeason': 'TV Season',
    'nav.upNext': 'Mi Lista',
    'nav.search': 'Buscar',
    'nav.signIn': 'Iniciar sesión',
    'nav.searchPlaceholder': 'Buscar películas, series...',

    // Hero / Actions
    'hero.original': 'Ruka Original',
    'hero.streamNow': 'Reproducir',
    'hero.addToUpNext': 'Añadir a Mi Lista',
    'hero.inUpNext': 'En Mi Lista',
    'hero.moreInfo': 'Más información',

    // Shelves
    'shelf.upNextTitle': 'Continuar viendo',
    'shelf.upNextSubtitle': 'Retoma la reproducción donde la dejaste',
    'shelf.topTenTitle': 'Top 10 en RukaTV',
    'shelf.topTenSubtitle': 'Las series y películas más vistas de la semana',
    'shelf.moviesTitle': 'Películas taquilleras',
    'shelf.moviesSubtitle': 'Disfruta de éxitos de cine en 4K UHD y Dolby Atmos',
    'shelf.seriesTitle': 'Series y dramas destacados',
    'shelf.seriesSubtitle': 'Temporadas completas y episodios exclusivos',
    'shelf.liveChannelsTitle': 'Canales de TV en directo',
    'shelf.liveChannelsSubtitle': 'Deportes, noticias y emisiones 24/7',
    'shelf.featuredCinemaTitle': 'Cine y acción recomendados',
    'shelf.featuredCinemaSubtitle': 'Películas aclamadas por la crítica en 4K',
    'shelf.live': 'EN DIRECTO',
    'shelf.original': 'Original',

    // Details Page
    'detail.back': 'Volver',
    'detail.streamNow': 'Reproducir ahora',
    'detail.play': 'Reproducir',
    'detail.addToUpNext': 'Añadir a Mi Lista',
    'detail.inUpNext': 'En Mi Lista',
    'detail.share': 'Compartir',
    'detail.linkCopied': 'Enlace copiado',
    'detail.overview': 'Sinopsis',
    'detail.starring': 'Reparto principal',
    'detail.direction': 'Dirección y producción',
    'detail.capabilities': 'Calidad de audio y vídeo',
    'detail.episodes': 'Episodios',
    'detail.season': 'Temporada',
    'detail.episode': 'Episodio',
    'detail.loadingEpisodes': 'Cargando episodios desde el servidor...',
    'detail.moreToWatch': 'Más contenido para ver',
    'detail.similar': 'Títulos similares que te pueden gustar',
    'detail.notFoundTitle': 'Título no encontrado',
    'detail.notFoundDesc': 'El contenido seleccionado no está disponible en este momento.',
    'detail.backHome': 'Volver al Inicio',
    'detail.loading': 'Cargando detalles de RukaTV+...',

    // TV Season / Live
    'tv.liveBadge': 'En directo 24/7 en RukaTV+',
    'tv.watchChannel': 'Ver canal',
    'tv.header': 'Canales de TV Season en directo',
    'tv.desc': 'Emisión continua directa desde el servidor.',
    'tv.available': 'Canales disponibles',
    'tv.all': 'Todos',
    'tv.sports': 'Deportes',
    'tv.news': 'Noticias',
    'tv.entertainment': 'Entretenimiento',
    'tv.movies': 'Películas',
    'tv.emptyTitle': 'No hay canales disponibles',
    'tv.emptyDesc': 'Comprueba la conexión con el servidor Xtream Code.',

    // Up Next / Watchlist
    'upnext.title': 'Mi Lista',
    'upnext.subtitle': 'Tu cola de reproducción sincronizada en todos tus dispositivos RukaTV.',
    'upnext.continue': 'Continuar viendo',
    'upnext.saved': 'Guardado en Mi Lista',
    'upnext.emptyTitle': 'Tu lista está vacía',
    'upnext.emptyDesc': 'Descubre Ruka Originals, películas y series para añadirlas a tu lista.',
    'upnext.explore': 'Explorar contenidos',

    // Search Page
    'search.title': 'Buscar',
    'search.subtitle': 'Explora películas, series, actores y canales en directo 24/7.',
    'search.placeholder': 'Buscar películas, series, actores o géneros...',
    'search.found': 'títulos encontrados',
    'search.showing': 'Mostrando resultados para',
    'search.noResultsTitle': 'No se encontraron resultados',
    'search.noResultsDesc': 'Comprueba la ortografía o prueba con otra categoría.',
    'search.loading': 'Buscando en el catálogo...',

    // Footer
    'footer.tagline': 'Ruka Originals y Entretenimiento en Directo',
    'footer.disclaimer1': '1. Requiere hardware y software compatible. La emisión en 4K UHD, HDR10 y Dolby Atmos depende del dispositivo y de la velocidad de conexión.',
    'footer.disclaimer2': '2. Las marcas comerciales de TV Season pertenecen a sus respectivos propietarios. Todos los derechos reservados.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de privacidad',
    'footer.terms': 'Términos de uso',
    'footer.sales': 'Ventas y reembolsos',
    'footer.legal': 'Aviso legal',
    'footer.support': 'Soporte técnico',

    // Language Modal
    'langModal.title': 'Seleccionar región e idioma',
    'langModal.subtitle': 'Elige el idioma preferido para la interfaz de RukaTV+.',
    'langModal.current': 'Idioma actual',
    'langModal.close': 'Cerrar',

    // Connection Error
    'error.title': 'No se pudo cargar el catálogo',
    'error.desc': 'Comprueba la conexión con el servidor Xtream Code en .env o el estado de tu red.',
    'error.retry': 'Reintentar conexión',
  },

  en: {
    // Navigation
    'nav.home': 'RukaTV+',
    'nav.tvSeason': 'TV Season',
    'nav.upNext': 'Up Next',
    'nav.search': 'Search',
    'nav.signIn': 'Sign In',
    'nav.searchPlaceholder': 'Search movies, series...',

    // Hero / Actions
    'hero.original': 'Ruka Original',
    'hero.streamNow': 'Stream Now',
    'hero.addToUpNext': 'Add to Up Next',
    'hero.inUpNext': 'In Up Next',
    'hero.moreInfo': 'More Information',

    // Shelves
    'shelf.upNextTitle': 'Up Next',
    'shelf.upNextSubtitle': 'Pick up right where you left off',
    'shelf.topTenTitle': 'Top 10 on RukaTV',
    'shelf.topTenSubtitle': 'The most-watched series and movies this week',
    'shelf.moviesTitle': 'Blockbuster Movies',
    'shelf.moviesSubtitle': 'Stream hit feature films in 4K UHD and Dolby Atmos',
    'shelf.seriesTitle': 'Top Series & Dramas',
    'shelf.seriesSubtitle': 'Binge full seasons and exclusive episodes',
    'shelf.liveChannelsTitle': 'Live TV Channels',
    'shelf.liveChannelsSubtitle': '24/7 sports, news, and live broadcasts',
    'shelf.featuredCinemaTitle': 'Featured Cinema & Action',
    'shelf.featuredCinemaSubtitle': 'Critically acclaimed movies streaming in 4K',
    'shelf.live': 'LIVE',
    'shelf.original': 'Original',

    // Details Page
    'detail.back': 'Back',
    'detail.streamNow': 'Stream Now',
    'detail.play': 'Play',
    'detail.addToUpNext': 'Add to Up Next',
    'detail.inUpNext': 'In Up Next',
    'detail.share': 'Share',
    'detail.linkCopied': 'Link Copied',
    'detail.overview': 'Overview',
    'detail.starring': 'Starring',
    'detail.direction': 'Direction & Studio',
    'detail.capabilities': 'Audio & Video Capabilities',
    'detail.episodes': 'Episodes',
    'detail.season': 'Season',
    'detail.episode': 'Episode',
    'detail.loadingEpisodes': 'Loading episodes from server...',
    'detail.moreToWatch': 'More to Watch',
    'detail.similar': 'Similar titles you might enjoy',
    'detail.notFoundTitle': 'Title Not Found',
    'detail.notFoundDesc': 'The requested content is currently unavailable in the catalog.',
    'detail.backHome': 'Return to Home',
    'detail.loading': 'Loading RukaTV+ details...',

    // TV Season / Live
    'tv.liveBadge': 'Live 24/7 on RukaTV+',
    'tv.watchChannel': 'Watch Channel',
    'tv.header': 'TV Season Live Channels',
    'tv.desc': '24/7 television channels streaming directly from the server.',
    'tv.available': 'Available Channels',
    'tv.all': 'All',
    'tv.sports': 'Sports',
    'tv.news': 'News',
    'tv.entertainment': 'Entertainment',
    'tv.movies': 'Movies',
    'tv.emptyTitle': 'No live channels available',
    'tv.emptyDesc': 'Please check the connection with the Xtream Code server.',

    // Up Next / Watchlist
    'upnext.title': 'Up Next',
    'upnext.subtitle': 'Your personal queue and synced playback across all RukaTV devices.',
    'upnext.continue': 'Continue Watching',
    'upnext.saved': 'Saved to Up Next',
    'upnext.emptyTitle': 'Your queue is empty',
    'upnext.emptyDesc': 'Explore Ruka Originals, award-winning movies, and hit series. Add them to Up Next to easily continue watching later.',
    'upnext.explore': 'Explore Content',

    // Search Page
    'search.title': 'Search',
    'search.subtitle': 'Explore movies, series, actors, and 24/7 live television channels.',
    'search.placeholder': 'Search movies, series, actors, or genres...',
    'search.found': 'titles found',
    'search.showing': 'Showing results for',
    'search.noResultsTitle': 'No results found',
    'search.noResultsDesc': 'Check your spelling or try exploring another category.',
    'search.loading': 'Searching catalog...',

    // Footer
    'footer.tagline': 'Ruka Originals & Live Entertainment',
    'footer.disclaimer1': '1. Compatible hardware and software required. 4K UHD, HDR10, Dolby Vision and Dolby Atmos streaming subject to device capabilities and connection speed.',
    'footer.disclaimer2': '2. TV Season trademarks and copyrights are property of their respective broadcast networks. All rights reserved.',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.sales': 'Sales Policy',
    'footer.legal': 'Legal',
    'footer.support': 'Support',

    // Language Modal
    'langModal.title': 'Select Region and Language',
    'langModal.subtitle': 'Choose your preferred language for the RukaTV+ interface.',
    'langModal.current': 'Current language',
    'langModal.close': 'Close',

    // Connection Error
    'error.title': 'Could not load catalog',
    'error.desc': 'Check your Xtream Code connection in .env or your network connectivity.',
    'error.retry': 'Retry connection',
  },

  pt: {
    // Navigation
    'nav.home': 'RukaTV+',
    'nav.tvSeason': 'TV Season',
    'nav.upNext': 'Minha Lista',
    'nav.search': 'Buscar',
    'nav.signIn': 'Entrar',
    'nav.searchPlaceholder': 'Buscar filmes, séries...',

    // Hero / Actions
    'hero.original': 'Ruka Original',
    'hero.streamNow': 'Assistir agora',
    'hero.addToUpNext': 'Adicionar à lista',
    'hero.inUpNext': 'Na lista',
    'hero.moreInfo': 'Mais informações',

    // Shelves
    'shelf.upNextTitle': 'Continuar assistindo',
    'shelf.upNextSubtitle': 'Continue exatamente de onde parou',
    'shelf.topTenTitle': 'Top 10 no RukaTV',
    'shelf.topTenSubtitle': 'As séries e filmes mais assistidos da semana',
    'shelf.moviesTitle': 'Filmes de Sucesso',
    'shelf.moviesSubtitle': 'Assista a grandes sucessos em 4K UHD e Dolby Atmos',
    'shelf.seriesTitle': 'Séries e Dramas em Destaque',
    'shelf.seriesSubtitle': 'Temporadas completas e episódios exclusivos',
    'shelf.liveChannelsTitle': 'Canais de TV ao Vivo',
    'shelf.liveChannelsSubtitle': 'Transmissões 24/7 de esportes, notícias e entretenimento',
    'shelf.featuredCinemaTitle': 'Cinema e Ação em Destaque',
    'shelf.featuredCinemaSubtitle': 'Filmes aclamados pela crítica em 4K',
    'shelf.live': 'AO VIVO',
    'shelf.original': 'Original',

    // Details Page
    'detail.back': 'Voltar',
    'detail.streamNow': 'Assistir agora',
    'detail.play': 'Assistir',
    'detail.addToUpNext': 'Adicionar à lista',
    'detail.inUpNext': 'Na lista',
    'detail.share': 'Compartilhar',
    'detail.linkCopied': 'Link copiado',
    'detail.overview': 'Sinopse',
    'detail.starring': 'Elenco principal',
    'detail.direction': 'Direção e estúdio',
    'detail.capabilities': 'Recursos de áudio e vídeo',
    'detail.episodes': 'Episódios',
    'detail.season': 'Temporada',
    'detail.episode': 'Episódio',
    'detail.loadingEpisodes': 'Carregando episódios do servidor...',
    'detail.moreToWatch': 'Mais para assistir',
    'detail.similar': 'Títulos semelhantes que você pode gostar',
    'detail.notFoundTitle': 'Título não encontrado',
    'detail.notFoundDesc': 'O conteúdo solicitado não está disponível no catálogo atual.',
    'detail.backHome': 'Voltar ao Início',
    'detail.loading': 'Carregando detalhes do RukaTV+...',

    // TV Season / Live
    'tv.liveBadge': 'Ao vivo 24/7 no RukaTV+',
    'tv.watchChannel': 'Assistir canal',
    'tv.header': 'Canais de TV Season ao vivo',
    'tv.desc': 'Transmissão contínua direta do servidor.',
    'tv.available': 'Canais disponíveis',
    'tv.all': 'Todos',
    'tv.sports': 'Esportes',
    'tv.news': 'Notícias',
    'tv.entertainment': 'Entretenimento',
    'tv.movies': 'Filmes',
    'tv.emptyTitle': 'Nenhum canal disponível',
    'tv.emptyDesc': 'Verifique a conexão com o servidor Xtream Code.',

    // Up Next / Watchlist
    'upnext.title': 'Minha Lista',
    'upnext.subtitle': 'Sua fila pessoal sincronizada em todos os seus aparelhos RukaTV.',
    'upnext.continue': 'Continuar assistindo',
    'upnext.saved': 'Salvo na Minha Lista',
    'upnext.emptyTitle': 'Sua lista está vazia',
    'upnext.emptyDesc': 'Explore Ruka Originals, filmes e séries para adicionar à sua lista.',
    'upnext.explore': 'Explorar catálogo',

    // Search Page
    'search.title': 'Buscar',
    'search.subtitle': 'Explore filmes, séries, atores e canais ao vivo 24/7.',
    'search.placeholder': 'Buscar filmes, séries, atores ou gêneros...',
    'search.found': 'títulos encontrados',
    'search.showing': 'Exibindo resultados para',
    'search.noResultsTitle': 'Nenhum resultado encontrado',
    'search.noResultsDesc': 'Verifique a ortografia ou tente explorar outra categoria.',
    'search.loading': 'Pesquisando no catálogo...',

    // Footer
    'footer.tagline': 'Ruka Originals e Entretenimento ao Vivo',
    'footer.disclaimer1': '1. Requer hardware e software compatíveis. Transmissões em 4K UHD, HDR10 e Dolby Atmos estão sujeitas aos recursos do dispositivo e velocidade da conexão.',
    'footer.disclaimer2': '2. As marcas registradas do TV Season pertencem aos seus respectivos proprietários. Todos os direitos reservados.',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Uso',
    'footer.sales': 'Política de Vendas',
    'footer.legal': 'Legal',
    'footer.support': 'Suporte',

    // Language Modal
    'langModal.title': 'Selecionar região e idioma',
    'langModal.subtitle': 'Escolha o idioma preferido para a interface do RukaTV+.',
    'langModal.current': 'Idioma atual',
    'langModal.close': 'Fechar',

    // Connection Error
    'error.title': 'Não foi possível carregar o catálogo',
    'error.desc': 'Verifique a conexão com o servidor Xtream Code em .env ou seu estado de rede.',
    'error.retry': 'Tentar novamente',
  },
} as const;

export type TranslationKey = keyof typeof translations['es'];
