import * as config from './config'


export function setupGoogleAnalytics() {
    window.addEventListener('load', async () => {
        // Deep magicks happening here. Best just walk away.
        ga = ga || function() {
            (ga.q = ga.q || []).push(arguments);
        }, ga.l = 1 * (new Date() as any);

        const _autotrackModule = await import(/* webpackChunkName: "autotrack" */ 'autotrack') as any;
        const _autotrackUrlChangeTrackerModule = await import(/* webpackChunkName: "autotrack" */ 'autotrack/lib/plugins/url-change-tracker') as any;
        ga('create', config.GOOGLE_ANALYTICS_ACCOUNT_ID, 'auto');
        ga('require', 'urlChangeTracker');
        ga('send', 'pageview');

        return [_autotrackModule, _autotrackUrlChangeTrackerModule]; // Do something with these
    });
}
