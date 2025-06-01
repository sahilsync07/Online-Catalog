<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Stock Groups</h1>

    <!-- Featured Groups with Logo Only -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div
        v-for="group in featuredGroups"
        :key="group.name"
        @click="goToGroupDetails(group.key)"
        class="cursor-pointer rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300"
      >
        <img
          :src="group.logo"
          :alt="group.name"
          class="w-full h-32 object-contain bg-white"
        />
      </div>
    </div>

    <!-- Other Groups as Text -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="group in otherGroups"
        :key="group.group"
        @click="goToGroupDetails(group.group)"
        class="cursor-pointer bg-white p-4 text-center rounded shadow hover:bg-gray-50 transition"
      >
        <p class="font-medium text-gray-800 text-lg">{{ group.group }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

// Use relative paths (not @) to avoid Windows space issues
import paragonLogo from "../assets/group-logos/Paragon.jpg";
import relianceLogo from "../assets/group-logos/Reliance.jpg";
import cubixLogo from "../assets/group-logos/Cubix.jpg";
import florexLogo from "../assets/group-logos/Florex.jpg";

const stockGroups = ref([]);
const router = useRouter();

const fetchStockSummary = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/tally/stock-summary");
    stockGroups.value = await res.json();
  } catch (error) {
    console.error("Error fetching stock summary:", error);
  }
};

const featuredGroupMap = {
  PARAGON: { name: "Paragon", logo: paragonLogo },
  "RELIANCE FOOTWEAR": { name: "Reliance", logo: relianceLogo },
  CUBIX: { name: "Cubix", logo: cubixLogo },
  "Florex (Swastik)": { name: "Florex", logo: florexLogo },
};

const featuredGroups = computed(() =>
  Object.entries(featuredGroupMap).map(([key, { name, logo }]) => ({
    key,
    name,
    logo,
  }))
);

const otherGroups = computed(() =>
  stockGroups.value.filter(
    (group) => !Object.keys(featuredGroupMap).includes(group.group)
  )
);

const goToGroupDetails = (groupName) => {
  router.push({ name: "GroupDetails", params: { groupName } });
};

onMounted(() => {
  fetchStockSummary();
});
</script>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
