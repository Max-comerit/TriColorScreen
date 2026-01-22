<template>
  <footer class="bg-neutral-900 text-white py-6 mt-12">
    <div class="flex justify-between px-5 md:px-10 text-sm md:text-base">
      <div>
        <h2 class="text-sm md:text-base font-semibold mb-2">Kontakt Info</h2>
        <ul class="space-y-1">
          <li class="flex items-center">
            <MapMarker class="w-6 h-6 text-accent-600 mr-2" aria-hidden="true" />
            <span>Öregrundsgatan 24, 115 59 Stockholm</span>
          </li>
          <li class="flex items-center">
            <EmailIcon class="w-6 h-6 text-accent-600 mr-2" aria-hidden="true" />
            <span>info@tricolorscreen.se</span>
          </li>
          <li class="flex items-center">
            <PhoneIcon class="w-6 h-6 text-accent-600 mr-2" aria-hidden="true" />
            <span>08-665 30 95</span>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-sm md:text-base font-semibold mb-2">Sociala Medier</h2>
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
    <div class="text-center text-sm md:text-base mt-6">
      <p>Copyright &copy; 2026 | Powered by Tricolorscreen</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import MapMarker from '~/assets/images/footer/map-marker.svg'
  import PhoneIcon from '~/assets/images/footer/phone-icon.svg'
  import EmailIcon from '~/assets/images/footer/email-icon.svg'
  import FacebookIcon from '~/assets/images/footer/facebook-icon.svg'
  import InstagramIcon from '~/assets/images/footer/instagram-icon.svg'
  import LinkedInIcon from '~/assets/images/footer/linkedin-icon.svg'

</script>
