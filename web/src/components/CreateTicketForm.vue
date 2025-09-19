<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 font-sans">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Form Section -->
        <div class="lg:col-span-3">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <div class="flex items-center justify-center gap-6 mb-4">
              <div>
                <img src="../assets/orbiz-logo.png" alt="Orbiz Logo" class="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 class="text-gray-800 text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">Form Ticketing</h1>
              </div>
            </div>
          </div>

          <form @submit.prevent="submitTicket" class="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>
            
            <div class="relative">
              <!-- Driver Information Section -->
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">Informasi Driver</h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Nama Driver -->
                  <div class="relative">
                    <label for="driver_name" class="block mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Nama Driver *
                    </label>
                    <input
                      id="driver_name"
                      v-model="formData.driver_name"
                      type="text"
                      required
                      placeholder="Masukkan nama driver"
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
                    />
                  </div>

                  <!-- NIK -->
                  <div class="relative">
                    <label for="nik" class="block mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      NIK *
                    </label>
                    <input
                      id="nik"
                      v-model="formData.nik"
                      type="text"
                      required
                      placeholder="Contoh: 3201234567890123"
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
                      maxlength="16"
                      @input="onlyNumbers($event, 'nik')"
                      inputmode="numeric"
                    />
                  </div>

                  <!-- Nomor HP -->
                  <div class="relative">
                    <label for="handphone_number" class="block mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Nomor HP *
                    </label>
                    <input
                      id="handphone_number"
                      v-model="formData.handphone_number"
                      type="text"
                      required
                      placeholder="08xxxxxxxxxx"
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
                      @input="onlyNumbers($event, 'handphone_number')"
                      inputmode="numeric"
                    />
                  </div>
                </div>
              </div>

              <!-- Vehicle Information Section -->
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">Informasi Kendaraan</h2>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <!-- Jenis Kendaraan -->
                  <div>
                    <label for="truck_type" class="block mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                      </svg>
                      Jenis Kendaraan *
                    </label>
                    <div class="relative">
                      <select
                        id="truck_type"
                        v-model="formData.truck_type"
                        required
                        class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50 appearance-none pr-12"
                      >
                        <option value="">Pilih Jenis Kendaraan</option>
                        <option value="Mitsubishi Canter">Mitsubishi Canter</option>
                        <option value="Isuzu Elf">Isuzu Elf</option>
                        <option value="Hino Dutro">Hino Dutro</option>
                        <option value="Toyota Dyna">Toyota Dyna</option>
                        <option value="Suzuki Carry">Suzuki Carry</option>
                        <option value="Daihatsu Gran Max">Daihatsu Gran Max</option>
                        <option value="Mitsubishi L300">Mitsubishi L300</option>
                        <option value="Isuzu Giga">Isuzu Giga</option>
                        <option value="Hino Ranger">Hino Ranger</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <!-- Custom Dropdown Arrow -->
                      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Plat Nomor -->
                  <div>
                    <label for="truck_type" class="block mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Plat Nomor *
                    </label>
                    <div class="grid grid-cols-3 gap-4">
                      <div class="relative">
                        <input
                          v-model="formData.license_plate_letters1"
                          type="text"
                          required
                          placeholder="B"
                          maxlength="2"
                          @input="onlyLetters($event, 'license_plate_letters1')"
                          class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base text-center uppercase transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-b from-white to-gray-50 font-bold text-lg"
                        />
                        <p class="text-xs text-gray-500 mt-2 text-center font-medium">1-2 huruf</p>
                      </div>
                      <div class="relative">
                        <input
                          v-model="formData.license_plate_numbers"
                          type="text"
                          required
                          placeholder="1234"
                          maxlength="4"
                          @input="onlyNumbers($event, 'license_plate_numbers')"
                          inputmode="numeric"
                          class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base text-center transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-b from-white to-gray-50 font-bold text-lg"
                        />
                        <p class="text-xs text-gray-500 mt-2 text-center font-medium">1-4 angka</p>
                      </div>
                      <div class="relative">
                        <input
                          v-model="formData.license_plate_letters2"
                          type="text"
                          required
                          placeholder="ABC"
                          maxlength="3"
                          @input="onlyLetters($event, 'license_plate_letters2')"
                          class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base text-center uppercase transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-b from-white to-gray-50 font-bold text-lg"
                        />
                        <p class="text-xs text-gray-500 mt-2 text-center font-medium">1-3 huruf</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Company Information Section -->
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">Informasi Perusahaan</h2>
                </div>

                <div class="relative">
                  <label for="principal" class="block mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Nama Perusahaan *
                  </label>
                  <div class="relative">
                    <select
                      id="principal"
                      v-model="formData.principal"
                      required
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50 appearance-none pr-12"
                    >
                      <option value="">Pilih Perusahaan</option>
                      <option value="PT Astra International">PT Astra International</option>
                      <option value="PT Unilever Indonesia">PT Unilever Indonesia</option>
                      <option value="PT Wings Surya">PT Wings Surya</option>
                      <option value="PT Indofood Sukses Makmur">PT Indofood Sukses Makmur</option>
                      <option value="PT Mayora Indah">PT Mayora Indah</option>
                      <option value="PT Nestle Indonesia">PT Nestle Indonesia</option>
                      <option value="PT Coca-Cola Indonesia">PT Coca-Cola Indonesia</option>
                      <option value="PT Danone Indonesia">PT Danone Indonesia</option>
                      <option value="PT Procter & Gamble Indonesia">PT Procter & Gamble Indonesia</option>
                      <option value="PT Johnson & Johnson Indonesia">PT Johnson & Johnson Indonesia</option>
                      <option value="PT Kalbe Farma">PT Kalbe Farma</option>
                      <option value="PT Sido Muncul">PT Sido Muncul</option>
                      <option value="PT Tzu Chi Indonesia">PT Tzu Chi Indonesia</option>
                      <option value="PT Kimia Farma">PT Kimia Farma</option>
                      <option value="CV Berkah Jaya">CV Berkah Jaya</option>
                      <option value="CV Maju Mandiri">CV Maju Mandiri</option>
                      <option value="CV Sejahtera Abadi">CV Sejahtera Abadi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <!-- Custom Dropdown Arrow -->
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Document Verification Section -->
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">Verifikasi Dokumen</h2>
                </div>

                <div class="p-8 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    <p class="text-amber-800 text-sm font-bold">SJ wajib, dan minimal salah satu dari KTP atau SIM harus tersedia</p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="relative">
                      <label class="flex items-center cursor-pointer text-sm text-gray-700 font-semibold relative pl-12 p-4 bg-white rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-green-300 hover:shadow-lg has-[:checked]:border-green-500 has-[:checked]:bg-green-50 has-[:checked]:shadow-lg">
                        <input
                          type="checkbox"
                          v-model="formData.sj_available"
                          class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                          required
                        />
                        <span class="absolute left-4 h-6 w-6 bg-white border-2 border-gray-300 rounded-lg transition-all duration-300 peer-hover:border-green-500 peer-checked:bg-green-500 peer-checked:border-green-500 shadow-sm after:content-[''] after:absolute after:hidden after:left-1.5 after:top-1 after:w-2 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                        <div class="flex items-center gap-3">
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <span>Surat Jalan (SJ)</span>
                        </div>
                      </label>
                    </div>

                    <div class="relative">
                      <label class="flex items-center cursor-pointer text-sm text-gray-700 font-semibold relative pl-12 p-4 bg-white rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-blue-300 hover:shadow-lg has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg">
                        <input
                          type="checkbox"
                          v-model="formData.ktp_available"
                          class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                        />
                        <span class="absolute left-4 h-6 w-6 bg-white border-2 border-gray-300 rounded-lg transition-all duration-300 peer-hover:border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 shadow-sm after:content-[''] after:absolute after:hidden after:left-1.5 after:top-1 after:w-2 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                        <div class="flex items-center gap-3">
                          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                          </svg>
                          <span>KTP</span>
                        </div>
                      </label>
                    </div>

                    <div class="relative">
                      <label class="flex items-center cursor-pointer text-sm text-gray-700 font-semibold relative pl-12 p-4 bg-white rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-purple-300 hover:shadow-lg has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 has-[:checked]:shadow-lg">
                        <input
                          type="checkbox"
                          v-model="formData.sim_available"
                          class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                        />
                        <span class="absolute left-4 h-6 w-6 bg-white border-2 border-gray-300 rounded-lg transition-all duration-300 peer-hover:border-purple-500 peer-checked:bg-purple-500 peer-checked:border-purple-500 shadow-sm after:content-[''] after:absolute after:hidden after:left-1.5 after:top-1 after:w-2 after:h-3 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 peer-checked:after:block"></span>
                        <div class="flex items-center gap-3">
                          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <span>SIM</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none rounded-2xl text-lg font-bold cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center gap-3"
              >
                <svg v-if="!isSubmitting" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <svg v-else class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ isSubmitting ? 'Memproses...' : 'Buat Tiket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-5 backdrop-blur-sm" @click="closeModal">
      <div class="bg-white p-10 rounded-3xl text-center max-w-md w-full shadow-2xl border border-gray-200 transform transition-all duration-300 scale-105" @click.stop>
        <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-lg animate-bounce">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="mb-4 text-2xl font-bold text-gray-800">Tiket Berhasil Dibuat!</h2>
        <p class="mb-8 text-gray-600">Tiket telah berhasil disimpan dalam sistem</p>
        <button @click="closeModal" class="py-4 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Tutup
        </button>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="errorMessage" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-5 backdrop-blur-sm" @click="clearError">
      <div class="bg-white p-10 rounded-3xl text-center max-w-md w-full shadow-2xl border border-gray-200 transform transition-all duration-300" @click.stop>
        <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-lg">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="mb-4 text-2xl font-bold text-gray-800">Terjadi Kesalahan</h2>
        <p class="mb-8 text-gray-600">{{ errorMessage }}</p>
        <button @click="clearError" class="py-4 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import convex from '../convex'
  import { useRouter } from 'vue-router'
  import { api } from '../../../backend/convex/_generated/api'

  const router = useRouter()

  const formData = reactive({
    driver_name: '',
    nik: '',
    handphone_number: '',
    license_plate_letters1: '',
    license_plate_numbers: '',
    license_plate_letters2: '',
    truck_type: '',
    principal: '',
    sj_available: false,
    ktp_available: false,
    sim_available: false
  })

  const isSubmitting = ref(false)
  const showSuccess = ref(false)
  const errorMessage = ref('')
  const createdTicket = ref(null)

  // Computed property untuk preview plat nomor
  const licensePlatePreview = computed(() => {
    const { license_plate_letters1, license_plate_numbers, license_plate_letters2 } = formData
    if (!license_plate_letters1 && !license_plate_numbers && !license_plate_letters2) {
      return 'Contoh: B 1234 ABC'
    }
    return `${license_plate_letters1} ${license_plate_numbers} ${license_plate_letters2}`.trim()
  })

  // Computed property untuk gabungan plat nomor lengkap
  const fullLicensePlate = computed(() => {
    return `${formData.license_plate_letters1}${formData.license_plate_numbers}${formData.license_plate_letters2}`
  })

  const submitTicket = async () => {
    try {
      isSubmitting.value = true
      errorMessage.value = ''

      // Gabungkan plat nomor dan hanya kirim field yang diterima backend
      const submitData = {
        driver_name: formData.driver_name,
        nik: formData.nik,
        handphone_number: formData.handphone_number,
        license_plate: fullLicensePlate.value,
        truck_type: formData.truck_type,
        principal: formData.principal,
        sj_available: formData.sj_available,
        ktp_available: formData.ktp_available,
        sim_available: formData.sim_available
      }

      console.log('Form data:', submitData) // Debug log

      // Validate all documents are checked
      if (!formData.sj_available || (!formData.ktp_available && !formData.sim_available)) {
        throw new Error('Dokumen SJ wajib tersedia, dan setidaknya salah satu dari KTP atau SIM harus tersedia sebelum melanjutkan')
      }

      // Validate license plate parts
      if (!formData.license_plate_letters1 || !formData.license_plate_numbers || !formData.license_plate_letters2) {
        throw new Error('Plat nomor harus diisi lengkap (huruf-angka-huruf)')
      }

      // Test connection first
      console.log('Convex URL:', import.meta.env.VITE_CONVEX_URL)

      // Call Convex mutation with direct HTTP call as fallback
      let result
      try {
        // Try direct API call first
        const response = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/create-ticket`.replace('.convex.cloud', '.convex.site'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        })

        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Server error')
        }
        
        result = data.data
      } catch (fetchError) {
        console.error('Direct API failed, trying Convex client:', fetchError)
        // Fallback to Convex client
        result = await convex.mutation(api.tickets.createTicket, submitData)
      }
      
      createdTicket.value = result
      showSuccess.value = true
      
      // Reset form
      formData.driver_name = ''
      formData.nik = ''
      formData.handphone_number = ''
      formData.license_plate_letters1 = ''
      formData.license_plate_numbers = ''
      formData.license_plate_letters2 = ''
      formData.truck_type = ''
      formData.principal = ''
      formData.sj_available = false
      formData.ktp_available = false
      formData.sim_available = false

      // Navigate to ticket list after success
      router.push('/')

    } catch (error: unknown) {
      console.error('Submit error:', error)
      if (error instanceof Error) {
        errorMessage.value = error.message || 'Gagal membuat tiket. Silahkan coba lagi.'
      } else {
        errorMessage.value = 'Gagal membuat tiket. Silahkan coba lagi.'
      }
    } finally {
      isSubmitting.value = false
    }
  }

  const closeModal = () => {
    showSuccess.value = false
    createdTicket.value = null
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  const onlyNumbers = (event: Event, field: string) => {
    const target = event.target as HTMLInputElement
    const value = target.value.replace(/[^0-9]/g, '') // Hapus semua karakter selain angka
    
    if (field === 'nik') {
      formData.nik = value
    } else if (field === 'handphone_number') {
      formData.handphone_number = value
    } else if (field === 'license_plate_numbers') {
      formData.license_plate_numbers = value
    }
    
    target.value = value // Update input value
  }

  const onlyLetters = (event: Event, field: string) => {
    const target = event.target as HTMLInputElement
    const value = target.value.replace(/[^A-Za-z]/g, '').toUpperCase() // Hapus semua karakter selain huruf dan ubah ke uppercase
    
    if (field === 'license_plate_letters1') {
      formData.license_plate_letters1 = value
    } else if (field === 'license_plate_letters2') {
      formData.license_plate_letters2 = value
    }
    
    target.value = value // Update input value
  }
</script>