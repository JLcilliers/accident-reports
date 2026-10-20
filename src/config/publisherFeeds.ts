/**
 * News publishers read directly, next to Google News, by /api/cron/ingest-publishers: each one's Google News
 * sitemap or, where it has none, its RSS feed. All allowed CarCrashReportBot in robots.txt when they were
 * checked on 2026-10-20, and robots.txt is read again before every fetch.
 *
 * `name` is the name Google News gives the publisher, so its stories count as the same publisher from either
 * source. `state` is the publisher's home state, used for a story whose headline names no place; national
 * publishers have none, so their stories need a place in the headline.
 */
export interface PublisherFeed {
  host: string;
  name: string;
  state: string | null;
  url: string;
}

export const PUBLISHER_FEEDS: PublisherFeed[] = [
  { host: "www.cbsnews.com", name: "CBS News", state: null, url: "https://www.cbsnews.com/xml-sitemap/news.xml" },
  { host: "abc7chicago.com", name: "ABC7 Chicago", state: "IL", url: "https://abc7chicago.com/sitemap/news.xml" },
  { host: "patch.com", name: "Patch", state: null, url: "https://patch.com/nsm/news-sitemap.xml" },
  { host: "www.cleveland19.com", name: "Cleveland 19 News", state: "OH", url: "https://www.cleveland19.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.tampabay28.com", name: "Tampa Bay 28", state: "FL", url: "https://www.tampabay28.com/news-sitemap-content.xml" },
  { host: "6abc.com", name: "6abc Philadelphia", state: "PA", url: "https://6abc.com/sitemap/news.xml" },
  { host: "www.fox4news.com", name: "FOX 4 News Dallas-Fort Worth", state: "TX", url: "https://www.fox4news.com/sitemap.xml?type=fastchanging" },
  { host: "www.azfamily.com", name: "AZ Family", state: "AZ", url: "https://www.azfamily.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "mynewsla.com", name: "MyNewsLA.com", state: "CA", url: "https://mynewsla.com/news-sitemap.xml" },
  { host: "www.nbcmiami.com", name: "NBC 6 South Florida", state: "FL", url: "https://www.nbcmiami.com/sitemap-news.xml" },
  { host: "www.cbs7.com", name: "CBS7 | Permian Basin, West Texas News | Midland, TX", state: "TX", url: "https://www.firstalert7.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "nypost.com", name: "New York Post", state: null, url: "https://nypost.com/news-sitemap.xml" },
  { host: "abc7ny.com", name: "ABC7 New York", state: "NY", url: "https://abc7ny.com/sitemap/news.xml" },
  { host: "www.nj.com", name: "NJ.com", state: "NJ", url: "https://www.nj.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "www.abc15.com", name: "ABC15 Arizona", state: "AZ", url: "https://www.abc15.com/news-sitemap-content.xml" },
  { host: "abc13.com", name: "ABC13 Houston", state: "TX", url: "https://abc13.com/sitemap/news.xml" },
  { host: "www.nbclosangeles.com", name: "NBC Los Angeles", state: "CA", url: "https://www.nbclosangeles.com/sitemap-news.xml" },
  { host: "www.nbcdfw.com", name: "NBC 5 Dallas-Fort Worth", state: "TX", url: "https://www.nbcdfw.com/sitemap-news.xml" },
  { host: "www.wyff4.com", name: "WYFF", state: "SC", url: "https://www.wyff4.com/sitemap_google_news.xml" },
  { host: "www.reviewjournal.com", name: "Las Vegas Review-Journal", state: "NV", url: "https://www.reviewjournal.com/feed/" },
  { host: "www.tampafp.com", name: "Tampa Free Press", state: "FL", url: "https://www.tampafp.com/feed/gn" },
  { host: "www.fox13seattle.com", name: "FOX 13 Seattle", state: "WA", url: "https://www.fox13seattle.com/sitemap.xml?type=fastchanging" },
  { host: "www.nbcchicago.com", name: "NBC 5 Chicago", state: "IL", url: "https://www.nbcchicago.com/sitemap-news.xml" },
  { host: "www.cleveland.com", name: "Cleveland.com", state: "OH", url: "https://www.cleveland.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "www.nbcconnecticut.com", name: "NBC Connecticut", state: "CT", url: "https://www.nbcconnecticut.com/sitemap-news.xml" },
  { host: "www.21alivenews.com", name: "WPTA | 21Alive | Fort Wayne, IN", state: "IN", url: "https://www.21alivenews.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.wxyz.com", name: "WXYZ 7 News Detroit", state: "MI", url: "https://www.wxyz.com/news-sitemap-content.xml" },
  { host: "ktnv.com", name: "ktnv.com", state: "NV", url: "https://www.ktnv.com/news-sitemap-content.xml" },
  { host: "www.fox10phoenix.com", name: "FOX 10 Phoenix", state: "AZ", url: "https://www.fox10phoenix.com/sitemap.xml?type=fastchanging" },
  { host: "www.fox5atlanta.com", name: "FOX 5 Atlanta", state: "GA", url: "https://www.fox5atlanta.com/sitemap.xml?type=fastchanging" },
  { host: "www.hawaiinewsnow.com", name: "Hawaii News Now", state: "HI", url: "https://www.hawaiinewsnow.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.orlando-news.com", name: "Orlando-News.com", state: "FL", url: "https://www.orlando-news.com/feed/" },
  { host: "wsvn.com", name: "WSVN", state: "FL", url: "https://wsvn.com/news-sitemap.xml" },
  { host: "www.seattletimes.com", name: "The Seattle Times", state: "WA", url: "https://www.seattletimes.com/feed/" },
  { host: "www.wfsb.com", name: "WFSB", state: "CT", url: "https://www.wfsb.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.fox32chicago.com", name: "FOX 32 Chicago", state: "IL", url: "https://www.fox32chicago.com/sitemap.xml?type=fastchanging" },
  { host: "www.thebanner.com", name: "The Baltimore Banner", state: "MD", url: "https://www.thebanner.com/arc/outboundfeeds/sitemap-news/?outputType=xml" },
  { host: "www.click2houston.com", name: "Click2Houston", state: "TX", url: "https://www.click2houston.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "www.kshb.com", name: "KSHB 41 Kansas City", state: "MO", url: "https://www.kshb.com/news-sitemap-content.xml" },
  { host: "abc30.com", name: "ABC30 Fresno", state: "CA", url: "https://abc30.com/sitemap/news.xml" },
  { host: "www.fox6now.com", name: "FOX6 News Milwaukee", state: "WI", url: "https://www.fox6now.com/sitemap.xml?type=fastchanging" },
  { host: "www.nbcsandiego.com", name: "NBC 7 San Diego", state: "CA", url: "https://www.nbcsandiego.com/sitemap-news.xml" },
  { host: "whdh.com", name: "WHDH", state: "MA", url: "https://whdh.com/news-sitemap.xml" },
  { host: "www.al.com", name: "AL.com", state: "AL", url: "https://www.al.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "www.fox9.com", name: "FOX 9 Minneapolis-St. Paul", state: "MN", url: "https://www.fox9.com/sitemap.xml?type=fastchanging" },
  { host: "www.denver7.com", name: "Denver7", state: "CO", url: "https://www.denver7.com/news-sitemap-content.xml" },
  { host: "www.fox5vegas.com", name: "FOX5 Vegas", state: "NV", url: "https://www.fox5vegas.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.fox35orlando.com", name: "FOX 35 Orlando", state: "FL", url: "https://www.fox35orlando.com/sitemap.xml?type=fastchanging" },
  { host: "www.kold.com", name: "KOLD", state: "AZ", url: "https://www.kold.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "onscene.tv", name: "onscene.tv", state: null, url: "https://onscene.tv/sitemap-news.xml" },
  { host: "www.fox13news.com", name: "FOX 13 Tampa Bay", state: "FL", url: "https://www.fox13news.com/sitemap.xml?type=fastchanging" },
  { host: "www.wmtv15news.com", name: "WMTV 15 NEWS", state: "WI", url: "https://www.wmtv15news.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.kcra.com", name: "KCRA", state: "CA", url: "https://www.kcra.com/sitemap_google_news.xml" },
  { host: "www.wmtw.com", name: "WMTW", state: "ME", url: "https://www.wmtw.com/sitemap_google_news.xml" },
  { host: "www.nbcboston.com", name: "NBC Boston", state: "MA", url: "https://www.nbcboston.com/sitemap-news.xml" },
  { host: "www.1011now.com", name: "KOLN | Nebraska Local News, Weather, Sports | Lincoln, NE", state: "NE", url: "https://www.1011now.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "www.atlantanewsfirst.com", name: "Atlanta News First", state: "GA", url: "https://www.atlantanewsfirst.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "3bmedianews.com", name: "3B Media News", state: "TN", url: "https://3bmedianews.com/feed/" },
  { host: "abc7.com", name: "ABC7 Los Angeles", state: "CA", url: "https://abc7.com/sitemap/news.xml" },
  { host: "www.wrtv.com", name: "WRTV", state: "IN", url: "https://www.wrtv.com/news-sitemap.xml" },
  { host: "thenevadaglobe.com", name: "Nevada Globe", state: "NV", url: "https://thenevadaglobe.com/feed/" },
  { host: "www.fox7austin.com", name: "FOX 7 Austin", state: "TX", url: "https://www.fox7austin.com/sitemap.xml?type=fastchanging" },
  { host: "www.wmar2news.com", name: "WMAR 2 News Baltimore", state: "MD", url: "https://www.wmar2news.com/news-sitemap-content.xml" },
  { host: "www.clickondetroit.com", name: "ClickOnDetroit | WDIV Local 4", state: "MI", url: "https://www.clickondetroit.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "clickorlando.com", name: "clickorlando.com", state: "FL", url: "https://www.clickorlando.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "www.fox26houston.com", name: "FOX 26 Houston", state: "TX", url: "https://www.fox26houston.com/sitemap.xml?type=fastchanging" },
  { host: "abc7news.com", name: "ABC7 San Francisco", state: "CA", url: "https://abc7news.com/sitemap/news.xml" },
  { host: "krdo.com", name: "KRDO", state: "CO", url: "https://krdo.com/feed/" },
  { host: "www.nbcphiladelphia.com", name: "NBC10 Philadelphia", state: "PA", url: "https://www.nbcphiladelphia.com/sitemap-news.xml" },
  { host: "abc11.com", name: "ABC11 News", state: "NC", url: "https://abc11.com/sitemap/news.xml" },
  { host: "fallriverreporter.com", name: "Fall River Reporter", state: "MA", url: "https://fallriverreporter.com/feed/" },
  { host: "www.ksat.com", name: "KSAT", state: "TX", url: "https://www.ksat.com/arc/outboundfeeds/news-sitemap/?outputType=xml" },
  { host: "dailymemphian.com", name: "Daily Memphian", state: "TN", url: "https://dailymemphian.com/feed/" },
  { host: "www.actionnews5.com", name: "Action News 5", state: "TN", url: "https://www.actionnews5.com/arc/outboundfeeds/news-sitemap/category/news/?outputType=xml" },
  { host: "wvmetronews.com", name: "WV MetroNews", state: "WV", url: "https://wvmetronews.com/feed/" },
];
