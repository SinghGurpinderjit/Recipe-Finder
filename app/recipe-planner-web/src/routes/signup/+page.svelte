<script lang="ts">
    import { goto } from "$app/navigation";
    import { auth } from "$lib/state/auth.svelte";
    import { toasts } from "$lib/state/toast.svelte";

    let name = $state("");
    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    async function onSubmit(e: Event) {
        e.preventDefault();
        error = "";
        loading = true;
        const result = await auth.signup(name, email, password);
        loading = false;
        if (!result.ok) {
            error = result.error ?? "Signup failed.";
            return;
        }
        toasts.show(`Welcome, ${name}!`, "success");
        goto("/");
    }
</script>

<svelte:head><title>Sign Up — Recipe Finder</title></svelte:head>

<div class="auth-page">
    <div class="auth-card">
        <h1>Create an Account</h1>

        <form onsubmit={onSubmit} class="auth-form">
            <label>
                Name
                <input type="text" bind:value={name} required />
            </label>
            <label>
                Email
                <input type="email" bind:value={email} required />
            </label>
            <label>
                Password
                <input
                    type="password"
                    bind:value={password}
                    minlength="6"
                    required
                />
            </label>

            {#if error}<p class="error">{error}</p>{/if}

            <button class="btn" type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Sign Up"}
            </button>
        </form>

        <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
</div>

<style>
    h1 {
        text-align: center;
    }

    .auth-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(90vh - 64px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }
    .auth-card {
        top: 0;
        width: 100%;
        max-width: 360px;
    }
    .auth-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.75rem;
        max-width: 360px;
    }
    .auth-form label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
    }
    .auth-form input {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
    }
    .error {
        color: #dc2626;
        font-size: 0.85rem;
    }
</style>
