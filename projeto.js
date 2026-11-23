/* =========================================
   LUMINA CINEMA - SCRIPT SIMPLIFICADO
   Autor: Tiago Cordeiro | RA: 22604732
   ========================================= */

   let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
   let categoriaAtual = 'todos';
   let slideAtual = 0;
   let tamanhoFonte = 100;
   
   // 1. MODO ESCURO / CLARO, FONTE E ALTO CONTRASTE
   function mudarTema() {
       document.documentElement.classList.remove('alto-contraste');
       const claro = document.documentElement.classList.toggle('light');
       document.getElementById('btn-tema').textContent = claro ? 'Modo Escuro' : 'Modo Claro';
       mostrarToast(claro ? 'Modo Claro ativado' : 'Modo Escuro ativado');
   }
   
   function mudarFonte(ajuste) {
       tamanhoFonte = ajuste === 0 ? 100 : Math.min(125, Math.max(85, tamanhoFonte + ajuste));
       document.documentElement.style.fontSize = tamanhoFonte + '%';
       mostrarToast('Tamanho da fonte: ' + tamanhoFonte + '%');
   }
   
   function alternarContraste() {
       const ativo = document.documentElement.classList.toggle('alto-contraste');
       document.getElementById('btn-contraste').classList.toggle('ativo', ativo);
       mostrarToast(ativo ? 'Alto Contraste ativado' : 'Alto Contraste desativado');
   }
   
   // 2. CARROSSEL
   function mudarSlide(direcao) {
       const total = document.querySelectorAll('.dot').length;
       if (!total) return;
       slideAtual = (slideAtual + direcao + total) % total;
       irParaSlide(slideAtual);
   }
   
   function irParaSlide(indice) {
       slideAtual = indice;
       const slides = document.getElementById('slides');
       if (slides) slides.style.transform = `translateX(-${indice * 100}%)`;
       document.querySelectorAll('.dot').forEach((dot, i) => {
           dot.classList.toggle('ativo', i === indice);
       });
   }
   setInterval(() => mudarSlide(1), 5000);
   
   // 3. FILTROS E BUSCA
   function selecionarAba(categoria, botao) {
       categoriaAtual = categoria;
       document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('ativo'));
       botao.classList.add('ativo');
       filtrarFilmes();
   }
   
   function filtrarFilmes() {
       const termo = document.getElementById('busca').value.toLowerCase();
       let visiveis = 0;
   
       document.querySelectorAll('.filme').forEach(card => {
           const id = card.dataset.id;
           const cat = card.dataset.cat;
           const texto = card.textContent.toLowerCase();
   
           const bateCategoria =
               categoriaAtual === 'todos' ||
               (categoriaAtual === 'watchlist' && watchlist.includes(id)) ||
               cat.includes(categoriaAtual);
   
           const mostrar = bateCategoria && texto.includes(termo);
           card.style.display = mostrar ? 'flex' : 'none';
           if (mostrar) visiveis++;
       });
   
       document.getElementById('total-filmes').textContent = visiveis;
       document.getElementById('vazio').classList.toggle('hidden', visiveis > 0);
   }
   
   // 4. WATCHLIST
   function favoritar(id, titulo) {
       if (watchlist.includes(id)) {
           watchlist = watchlist.filter(item => item !== id);
           mostrarToast(titulo + ' removido da Watchlist');
       } else {
           watchlist.push(id);
           mostrarToast(titulo + ' salvo na Watchlist');
       }
       localStorage.setItem('watchlist', JSON.stringify(watchlist));
       atualizarWatchlist();
       filtrarFilmes();
   }
   
   function atualizarWatchlist() {
       const contador = document.getElementById('contador');
       if (contador) contador.textContent = watchlist.length;
       document.querySelectorAll('.fav-btn').forEach(btn => {
           btn.classList.toggle('salvo', watchlist.includes(btn.dataset.id));
       });
   }
   
   // 5. MODAIS (LOGIN E TRAILER), CONTATO E TOAST
   function abrirModal(id) {
       const modal = document.getElementById(id);
       if (modal) modal.classList.add('aberto');
   }
   
   function fecharModal(id) {
       const modal = document.getElementById(id);
       if (modal) modal.classList.remove('aberto');
   }
   
   function abrirTrailer(titulo) {
       document.getElementById('titulo-trailer').textContent = 'Trailer: ' + titulo;
       abrirModal('modal-trailer');
   }
   
   function verSenha() {
       const campo = document.getElementById('login-senha');
       campo.type = campo.type === 'password' ? 'text' : 'password';
   }
   
   function fazerLogin(event) {
       event.preventDefault();
       const email = document.getElementById('login-email').value;
       document.getElementById('user-label').textContent = email.split('@')[0];
       fecharModal('modal-login');
       mostrarToast('Bem-vindo ao Clube Lumina!');
   }
   
   function enviarContato(event) {
       event.preventDefault();
       event.target.reset();
       mostrarToast('Mensagem enviada com sucesso!');
   }
   
   let timerToast;
   function mostrarToast(mensagem) {
       const toast = document.getElementById('toast');
       document.getElementById('toast-msg').textContent = mensagem;
       toast.classList.add('visivel');
       clearTimeout(timerToast);
       timerToast = setTimeout(() => toast.classList.remove('visivel'), 3000);
   }
   
   // Fecha modal ao clicar fora da caixa ou apertar Esc
   document.addEventListener('click', (e) => {
       if (e.target.classList.contains('modal')) {
           e.target.classList.remove('aberto');
       }
   });
   document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
           document.querySelectorAll('.modal').forEach(m => m.classList.remove('aberto'));
       }
   });
   
   atualizarWatchlist();