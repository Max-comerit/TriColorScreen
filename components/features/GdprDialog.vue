// components/features/GdprDialog.vue

<script setup lang="ts">
// ===== IMPORTS =====
import InfoDialog from '~/components/layout/InfoDialog.vue'

// ===== TYPES =====
/** Props for GdprDialog component */
interface Props {
  /** Controls modal visibility via v-model */
  modelValue: boolean
}

// ===== PROPS & EMITS =====
defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <InfoDialog
    :model-value="modelValue"
    title="Integritetspolicy och GDPR"
    ok-label="Jag förstår"
    width="40rem"
    height="75svh"
    inner-border="sunken"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 text-base text-neutral-900">
      <section>
        <h3 class="font-semibold text-lg my-2">Personuppgiftsansvarig</h3>
        <p class="text-base">
          Tricolor Screen är personuppgiftsansvarig för behandlingen av dina personuppgifter.
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Vilka uppgifter samlar vi in?</h3>
        <p class="mb-2 text-base">
          När du kontaktar oss via formuläret samlar vi in följande uppgifter:
        </p>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li>Namn</li>
          <li>E-postadress</li>
          <li>Telefonnummer (om angivet)</li>
          <li>Kundtyp (privatperson eller företag)</li>
          <li>Ämne och meddelande</li>
          <li>Eventuell bifogad bild</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Ändamål och rättslig grund</h3>
        <p class="text-base mb-2">
          Vi behandlar dina personuppgifter för att kunna svara på din förfrågan och tillhandahålla våra tjänster. 
          Den rättsliga grunden för behandlingen är:
        </p>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li><strong>Avtal:</strong> För att kunna fullgöra avtal eller vidta åtgärder innan avtal ingås</li>
          <li><strong>Samtycke:</strong> Genom att fylla i och skicka formuläret ger du ditt samtycke till behandlingen</li>
          <li><strong>Berättigat intresse:</strong> För att kunna bedriva och utveckla vår verksamhet</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Hur länge sparar vi dina uppgifter?</h3>
        <p class="text-base">
          Vi sparar dina personuppgifter så länge det är nödvändigt för att fullgöra de ändamål som uppgifterna samlades in för. 
          Uppgifter kan sparas längre om det krävs enligt lag eller för att bevaka våra rättsliga intressen.
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Dina rättigheter</h3>
        <p class="text-base mb-2">
          Enligt dataskyddsförordningen (GDPR) har du följande rättigheter:
        </p>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li><strong>Rätt till tillgång:</strong> Du har rätt att få information om vilka uppgifter vi behandlar om dig</li>
          <li><strong>Rätt till rättelse:</strong> Du kan begära att felaktiga uppgifter rättas</li>
          <li><strong>Rätt till radering:</strong> Du kan begära att dina uppgifter raderas</li>
          <li><strong>Rätt till begränsning:</strong> Du kan begära att behandlingen av dina uppgifter begränsas</li>
          <li><strong>Rätt till dataportabilitet:</strong> Du kan begära att få ut dina uppgifter i ett strukturerat format</li>
          <li><strong>Rätt att göra invändningar:</strong> Du kan invända mot behandling av dina uppgifter</li>
          <li><strong>Rätt att återkalla samtycke:</strong> Du kan när som helst återkalla ditt samtycke</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Delning av uppgifter</h3>
        <p class="text-base">
          Vi delar inte dina personuppgifter med tredje part utan ditt samtycke, förutom när det krävs enligt lag 
          eller för att fullgöra våra åtaganden gentemot dig.
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Säkerhet</h3>
        <p class="text-base">
          Vi vidtar tekniska och organisatoriska säkerhetsåtgärder för att skydda dina personuppgifter mot 
          obehörig åtkomst, förlust, förstöring eller annan otillbörlig behandling.
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Kontakta oss</h3>
        <p class="text-base">
          Om du har frågor om hur vi behandlar dina personuppgifter eller vill utöva dina rättigheter, 
          kontakta oss på den e-postadress eller det telefonnummer som finns på vår webbplats.
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-lg mb-2">Klagomål</h3>
        <p class="text-base">
          Om du anser att vi behandlar dina personuppgifter på ett felaktigt sätt har du rätt att lämna klagomål 
          till Integritetsskyddsmyndigheten (IMY).
        </p>
      </section>
    </div>
  </InfoDialog>
</template>
