<template>
	<div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 font-sans flex flex-col items-center justify-center">
		<div class="max-w-md w-full bg-white rounded-3xl shadow-xl border border-purple-100 p-10 flex flex-col items-center">
			<div class="mb-6">
				<img src="../../assets/orbiz-logo.png" alt="Orbiz Logo" class="w-16 h-16 object-contain mx-auto" />
			</div>
			<h1 class="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6c366a] to-purple-600 mb-4">404</h1>
			<h2 class="text-2xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
			<p class="text-slate-600 text-lg mb-6 text-center">Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>
			<button @click="goHome" class="py-3 px-8 bg-gradient-to-r from-[#6c366a] to-purple-600 hover:from-purple-700 hover:to-[#6c366a] text-white border-none rounded-xl font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">Kembali ke Beranda</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
	router.push('/')
}
</script>

<style scoped>
body {
	background: linear-gradient(to bottom right, #f8fafc, #f3e8ff, #c7d2fe);
}
</style>
