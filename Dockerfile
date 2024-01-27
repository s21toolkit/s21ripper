FROM mcr.microsoft.com/playwright:v1.41.1-jammy

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm i

COPY ./src ./src

CMD pnpm run run