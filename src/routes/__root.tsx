import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 display-3 font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-base text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display-3 font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      /* ⚠️ Estes eram os padrões do scaffold: "Lovable App", "Lovable Generated
         Project", `author: Lovable` e `twitter:site: @Lovable`. As três rotas
         sobrescrevem título e descrição, então o título nunca vazou — mas autor e
         perfil do Twitter vazavam em toda página, num site de clínica. */
      { title: "Suzuki Odontologia" },
      {
        name: "description",
        content:
          "Clínica odontológica de alta complexidade em Curitiba/PR, com corpo clínico de especialistas.",
      },
      { name: "author", content: "Suzuki Odontologia" },
      { property: "og:title", content: "Suzuki Odontologia" },
      {
        property: "og:description",
        content:
          "Clínica odontológica de alta complexidade em Curitiba/PR, com corpo clínico de especialistas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      /* Cor da barra do navegador no celular: o petróleo da marca. Medido do token
         `--ink` rasterizado em sRGB — oklch(0.213 0.040 197) é #001e1f. */
      { name: "theme-color", content: "#001e1f" },
      /* ⚠️ DEPLOY STEP — `og:image` e `og:url` precisam de URL ABSOLUTA, que só
         existe depois de publicar. Enquanto forem relativas, a prévia de link no
         WhatsApp e no Instagram sai sem imagem. Ao publicar, trocar as duas pelo
         endereço real (o do preview do projeto ou o domínio próprio).
         A imagem é a recepção da clínica; prévia de link corta para ~1,91:1, então
         se um dia houver arte dedicada de 1200×630 ela entra aqui. */
      { property: "og:image", content: "/imagens/estrutura/02-recepcao.webp" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Fontes por <link>, não por @import no CSS: o lightningcss do Tailwind
      // v4 tenta resolver URL remota como arquivo local e quebra o build.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // JetBrains Mono saiu em 30/07: a monoespaçada era o sinal mais forte de
        // "ferramenta de desenvolvedor" no layout, e nenhum rótulo do site usa
        // mais. Menos uma família baixada.
        href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    /* ⚠️ `pt-BR`, e isso é defeito de acessibilidade corrigido, não preferência: o
       site é inteiro em português e estava declarado `en`. Leitor de tela pronuncia
       tudo com fonética inglesa, e "Odontologia" vira algo que ninguém entende. */
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  /* PAUSA TODA ANIMAÇÃO QUANDO A ABA ESTÁ ESCONDIDA.
     Laço rodando em aba de fundo gasta bateria e é um dos itens do "motion system" da
     skill. Só liga e desliga UMA classe no `body`; a regra que faz o trabalho está no
     `styles.css`, e ela precisa atingir elemento E pseudo-elemento diretamente,
     porque `animation-play-state` não é herdada. */
  useEffect(() => {
    const aplica = () => document.body.classList.toggle("pausado", document.hidden);
    aplica();
    document.addEventListener("visibilitychange", aplica);
    return () => {
      document.removeEventListener("visibilitychange", aplica);
      document.body.classList.remove("pausado");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
