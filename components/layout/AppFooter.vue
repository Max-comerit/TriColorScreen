<script setup lang="ts">
  import MapMarker from '~/assets/images/footer/map-marker.svg'
  import PhoneIcon from '~/assets/images/footer/phone-icon.svg'
  import EmailIcon from '~/assets/images/footer/email-icon.svg'
  import FacebookIcon from '~/assets/images/footer/facebook-icon.svg'
  import InstagramIcon from '~/assets/images/footer/instagram-icon.svg'
  import LinkedInIcon from '~/assets/images/footer/linkedin-icon.svg'
</script>

<template>
  <footer class="min-h-[200px] h-auto bg-neutral-900 text-white py-6 mt-12 justify-center px-5">
    <div class="flex items-top justify-between text-sm md:text-base max-w-screen-xl mx-auto">
      <div>
        <h2 class="text-sm md:text-base font-semibold my-2 mb-4 text-inherit">Kontakt Info</h2>
        <ul class="space-y-1">
          <li class="flex items-center text-inherit">
            <MapMarker class="w-6 h-6 text-accent-400 mr-2" aria-hidden="true" />
            <address>Öregrundsgatan 24, 115 59 Stockholm</address>
          </li>
          <li class="flex items-center text-inherit">
            <EmailIcon class="w-6 h-6 text-accent-400 mr-2" aria-hidden="true" />
            <address>info@tricolorscreen.se</address>
          </li>
          <li class="flex items-center text-inherit">
            <PhoneIcon class="w-6 h-6 text-accent-400 mr-2" aria-hidden="true" />
            <address>08-665 30 95</address>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-sm md:text-base font-semibold my-2 mb-4 text-inherit">Sociala Medier</h2>
        <ul class="flex gap-3">
          <li>
            <a
              href="https://www.linkedin.com/in/ruben-veizaga-856a561a6/?originalSubdomain=se"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="hover:underline focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary rounded"
            >
              <LinkedInIcon class="w-7 h-7 text-neutral-900" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/tricolorscreen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="hover:underline focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary rounded"
            >
              <FacebookIcon class="w-7 h-7 text-neutral-900" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/tricolorscreen/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="hover:underline focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary rounded"
            >
              <InstagramIcon class="w-7 h-7 text-neutral-900" aria-hidden="true" />
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
