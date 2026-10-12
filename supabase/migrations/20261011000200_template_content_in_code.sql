-- O conteúdo demonstrativo de cada modelo vive no código (src/templates/*),
-- junto do layout. A tabela guarda os metadados comerciais controlados pelo
-- admin (ativo, ordem, plano, imagem) e o tema padrão. Ao criar um cardápio,
-- o servidor copia o conteúdo do registro em código e grava template_version.
alter table public.menu_templates alter column demo_document drop not null;
comment on column public.menu_templates.demo_document is 'Opcional. Conteúdo demonstrativo é lido de src/templates/<slug>/definition.ts';
