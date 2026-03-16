<script setup lang="ts">
  import MapMarker from '~/assets/images/footer/map-marker.svg'
  import PhoneIcon from '~/assets/images/footer/phone-icon.svg'
  import EmailIcon from '~/assets/images/footer/email-icon.svg'
  import FacebookIcon from '~/assets/images/footer/facebook-icon.svg'
  import InstagramIcon from '~/assets/images/footer/instagram-icon.svg'
  import LinkedInIcon from '~/assets/images/footer/linkedin-icon.svg'
  import TikTokIcon from '~/assets/images/footer/tiktok-icon.svg'
</script>

<template>
  <footer class="min-h-[200px] h-auto bg-neutral-900 text-white py-6 mt-12 justify-center px-5">
    <div class="flex items-top justify-between text-sm md:text-base max-w-screen-xl mx-auto">
      <div class="mr-3">
        <h2 class="text-lg my-2 mb-4 text-inherit font-semibold pl-1">Kontakt Info</h2>
        <ul class="space-y-1 text-white">
          <li class="flex items-center">
            <MapMarker class="w-6 h-6 text-accent-400 mr-2" aria-hidden="true" />
            <address>Öregrundsgatan 24, 115 59 Stockholm</address>
          </li>
          <li class="flex items-center">
            <EmailIcon class="w-6 h-6 text-accent-400 mr-2" aria-hidden="true" />
            <address>info@tricolorscreen.se</address>
          </li>
          <li class="flex items-center">
            <PhoneIcon class="w-6 h-6 text-accent-400 mr-2" aria-hidden="true" />
            <address>08-665 30 95</address>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-lg my-2 mb-4 text-inherit font-semibold pl-1">Sociala Medier</h2>
        <ul class="flex flex-wrap sm:flex-nowrap gap-3">
          <li>
            <a
              href="https://www.linkedin.com/in/ruben-veizaga-856a561a6/?originalSubdomain=se"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="p-0 rounded"
            >
              <LinkedInIcon class="size-9 sm:size-11 text-neutral-900 active:scale-95 transition-all" style="transition-duration: var(--tap-duration);" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/tricolorscreen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="p-0 rounded"
            >
              <FacebookIcon class="size-9 sm:size-11 text-neutral-900 active:scale-95 transition-all" style="transition-duration: var(--tap-duration);" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/tricolorscreen/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="p-0 rounded"
            >
              <InstagramIcon class="size-9 sm:size-11 text-neutral-900 active:scale-95 transition-all" style="transition-duration: var(--tap-duration);" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.tiktok.com/@rubenrobertosiles?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              class="p-0 rounded"
            >
              <TikTokIcon class="size-9 sm:size-11 text-neutral-900 active:scale-95 transition-all" style="transition-duration: var(--tap-duration);" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-6">
      <p class="text-center text-sm md:text-base text-inherit">Copyright &copy; 2026 | Powered by Tricolorscreen</p>
    </div>
  </footer>
</template>
