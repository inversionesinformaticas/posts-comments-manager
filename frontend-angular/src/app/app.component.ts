import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell d-flex flex-column">
      <nav class="navbar app-navbar">
        <div class="container app-container navbar-inner">
          <div class="d-flex flex-wrap justify-content-between align-items-start w-100 gap-3">
            <div class="d-flex align-items-center gap-3 py-1">
              <span class="brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                  <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
                </svg>
              </span>
              <div>
                <a class="navbar-brand d-block" routerLink="/posts">Posts & Comments Manager</a>
                <p class="navbar-subtitle mb-0">Panel de publicaciones</p>
              </div>
            </div>
            <div class="navbar-nav flex-row gap-0 ms-auto">
              <a class="nav-link" routerLink="/posts" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Listado
              </a>
              <a class="nav-link" routerLink="/posts/new" routerLinkActive="active">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                Nuevo post
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main class="container app-container app-main flex-grow-1">
        <router-outlet />
      </main>

      <footer class="app-footer mt-auto">
        <div class="container app-container text-center">
          <span>Posts & Comments Manager © 2026</span>
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {}
