<script setup lang="ts">
// Test page to trigger different error codes
// Visit with query params: ?code=500, ?code=403, ?code=503, etc.

const route = useRoute()
const errorCode = Number(route.query.code) || 500

const errorMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
}

throw createError({
  statusCode: errorCode,
  statusMessage: errorMessages[errorCode] || 'Unknown Error',
})
</script>

<template>
  <div>
    <!-- This template won't render due to the error being thrown -->
  </div>
</template>